// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const { product_id, new_state_code } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Porte fermée (code 0) → annuler la notification en attente
    if (new_state_code === 0) {
      await supabase
        .from("pending_notifications")
        .delete()
        .eq("product_id", product_id);

      return new Response(JSON.stringify({ cancelled: true }), { status: 200 });
    }

    // Porte ouverte (code 1) → planifier une notification
    if (new_state_code === 1) {
      const { data: product } = await supabase
        .from("products")
        .select("id, user_id, name, notification_delay")
        .eq("id", product_id)
        .single();

      if (!product) return new Response("Product not found", { status: 404 });

      const scheduledAt = new Date(
        Date.now() + product.notification_delay * 1000,
      ).toISOString();

      await supabase
        .from("pending_notifications")
        .upsert(
          {
            product_id: product.id,
            user_id: product.user_id,
            scheduled_at: scheduledAt,
          },
          { onConflict: "product_id" },
        );

      return new Response(JSON.stringify({ scheduled_at: scheduledAt }), {
        status: 200,
      });
    }

    return new Response("Unknown state", { status: 400 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
