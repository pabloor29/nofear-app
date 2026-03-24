import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface StateEntry {
  code: number;
  date: string;
}

interface ProductState {
  history: StateEntry[];
}

interface ProductRecord {
  id: string;
  user_id: string;
  state: ProductState | null;
  [key: string]: unknown;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: ProductRecord;
  old_record: ProductRecord;
}

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const payload: WebhookPayload = await req.json();
    const { record, old_record } = payload;

    // Extract last history entries
    const newHistory = record.state?.history ?? [];
    const oldHistory = old_record.state?.history ?? [];

    const lastNew = newHistory[newHistory.length - 1];
    const lastOld = oldHistory[oldHistory.length - 1];

    // Only proceed if the new state is code 0 (inactive)
    if (!lastNew || lastNew.code !== 0) {
      return new Response("No transition to 0", { status: 200 });
    }

    // Only proceed if this is a new entry (history grew) or the code actually changed from non-0
    const isNewEntry = newHistory.length > oldHistory.length;
    const codeChanged = lastOld && lastOld.code !== 0;
    if (!isNewEntry && !codeChanged) {
      return new Response("No relevant change", { status: 200 });
    }

    console.log("Transition détectée, attente 30s...");

    // Wait 30 seconds before re-checking
    await new Promise((resolve) => setTimeout(resolve, 30_000));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Re-fetch the product to check current state
    const { data: freshProduct, error: fetchError } = await supabase
      .from("products")
      .select("id, user_id, state")
      .eq("id", record.id)
      .single();

    if (fetchError || !freshProduct) {
      console.error("Erreur lors du re-fetch:", fetchError?.message);
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 500 });
    }

    const freshHistory: StateEntry[] = freshProduct.state?.history ?? [];
    const freshLast = freshHistory[freshHistory.length - 1];
    const currentCode = freshLast?.code ?? -1;

    console.log(`Re-check: code actuel = ${currentCode}`);

    if (currentCode !== 0) {
      console.log("Notification annulée");
      return new Response("cancelled", { status: 200 });
    }

    // Fetch the user's push token
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("push_token")
      .eq("id", freshProduct.user_id)
      .single();

    if (profileError || !profile?.push_token) {
      console.log("Aucun push_token trouvé pour cet utilisateur");
      return new Response("No push token", { status: 200 });
    }

    // Send the push notification via Expo
    const message = {
      to: profile.push_token,
      sound: "default",
      title: "Changement d'état",
      body: "Votre produit est inactif.",
      data: { productId: record.id },
    };

    const expoResponse = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
      },
      body: JSON.stringify(message),
    });

    if (!expoResponse.ok) {
      const body = await expoResponse.text();
      console.error("Erreur Expo API:", body);
      return new Response(JSON.stringify({ error: "Expo API error", body }), { status: 500 });
    }

    console.log("Notification envoyée");
    return new Response(JSON.stringify({ sent: true }), { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Erreur inattendue:", message);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});
