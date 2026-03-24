// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: pending } = await supabase
      .from("pending_notifications")
      .select(`
        id,
        product_id,
        products ( name ),
        profiles ( expo_push_token )
      `)
      .lte("scheduled_at", new Date().toISOString());

    if (!pending?.length) {
      return new Response("Nothing to send", { status: 200 });
    }

    const messages = pending
      .filter((n: any) => n.profiles?.expo_push_token)
      .map((n: any) => ({
        to: n.profiles.expo_push_token,
        sound: "default",
        title: "🔓 Porte ouverte",
        body: `${n.products.name} est toujours ouverte.`,
        data: { product_id: n.product_id },
      }));

    if (messages.length > 0) {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Accept-Encoding": "gzip, deflate",
        },
        body: JSON.stringify(messages),
      });
    }

    const ids = pending.map((n: any) => n.id);
    await supabase.from("pending_notifications").delete().in("id", ids);

    return new Response(JSON.stringify({ sent: messages.length }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});