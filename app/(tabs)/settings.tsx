import Account from "@/components/Account";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import Auth from "../../components/Auth";
import { supabase } from "../../lib/supabase";
import { useFocusEffect } from "expo-router";
import { useProfile } from "@/hooks/use-profile";

export default function Settings() {
  const [session, setSession] = useState<Session | null>(null);
  const { profile, loading, refetch } = useProfile(); // ← unique source

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  return (
    <View className="flex-1">
      {session && session.user ? (
        <Account session={session} profile={profile} loading={loading} />
      ) : (
        <Auth />
      )}
    </View>
  );
}