import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED") {
        setSession(session);
      }

      if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
        setSession(null);
      }

      // Gère le refresh token invalide
      if (event === "SIGNED_IN") {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session };
}