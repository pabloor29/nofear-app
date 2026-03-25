import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface StateEntry {
  code: number;
  date: string;
}

interface ProductRecord {
  id: string;
  user_id: string;
  state: { history: StateEntry[] } | null;
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

    const newHistory = record.state?.history ?? [];
    const oldHistory = old_record?.state?.history ?? [];

    const lastNew = newHistory[newHistory.length - 1];
    const lastOld = oldHistory[oldHistory.length - 1];

    // Ignorer code 99 et les cas sans changement
    if (!lastNew || lastNew.code === 99) {
      return new Response("Ignored", { status: 200 });
    }

    // Ignorer si le code n'a pas changé
    const isNewEntry = newHistory.length > oldHistory.length;
    const codeChanged = !lastOld || lastOld.code !== lastNew.code;
    if (!isNewEntry && !codeChanged) {
      return new Response("No relevant change", { status: 200 });
    }

    const detectedCode = lastNew.code;
    const detectedDate = lastNew.date;

    EdgeRuntime.waitUntil((async () => {
      console.log(`Transition détectée vers code ${detectedCode}, attente 5s...`);
      await new Promise((resolve) => setTimeout(resolve, 5_000));

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Re-fetch pour vérifier que l'état n'a pas changé
      const { data: freshProduct } = await supabase
        .from("products")
        .select("id, user_id, state")
        .eq("id", record.id)
        .single();

      if (!freshProduct) return;

      const freshHistory: StateEntry[] = freshProduct.state?.history ?? [];
      const freshLast = freshHistory[freshHistory.length - 1];

      console.log(`Re-check: code actuel = ${freshLast?.code}`);

      // Si l'état a changé depuis le déclenchement → annuler
      if (!freshLast || freshLast.date !== detectedDate) {
        console.log("Notification annulée — état modifié entre-temps");
        return;
      }

      // Récupérer le push token
      const { data: profile } = await supabase
        .from("profiles")
        .select("push_token")
        .eq("id", freshProduct.user_id)
        .single();

      if (!profile?.push_token) {
        console.log("Aucun push_token trouvé");
        return;
      }

      // Message selon l'état
      const title = "Changement d'état";
      const body = freshLast.code === 1
        ? "La porte est fermée 🔒"
        : freshLast.code === 0
        ? "La porte est ouverte 🔓"
        : null;

      if (!body) {
        console.log("Code ignoré:", freshLast.code);
        return;
      }

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: profile.push_token,
          sound: "default",
          title,
          body,
          data: { productId: record.id, code: freshLast.code },
        }),
      });

      console.log(`Notification envoyée: ${body}`);
    })());

    return new Response("processing", { status: 200 });

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("Erreur inattendue:", message);
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});