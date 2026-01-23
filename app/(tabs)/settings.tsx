import Account from "@/components/Account";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Auth from "../../components/Auth";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <View className="flex-1">
      {session && session.user ? <Account session={session} /> : <Auth />}
    </View>
  );
}
