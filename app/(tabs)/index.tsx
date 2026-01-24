import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Auth from "../../components/Auth";
import { supabase } from "../../lib/supabase";

export default function Index() {
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
    <View className="flex-1 justify-center items-center">
      {session && session.user ? <Text>No house detected...</Text> : <Auth />}
    </View>
  );
}
