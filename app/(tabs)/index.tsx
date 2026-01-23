import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import Auth from '../../components/Auth';
import Account from '../../components/Account';
import { Session } from '@supabase/supabase-js';

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
    <View className="flex justify-center items-center h-screen">
      {session && session.user ? (
        <Text>No house detected...</Text>
      ) : (
        <Auth />
      )}
    </View>
  );
}