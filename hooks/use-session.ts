import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setLoading(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    // Si le token est invalide, on déconnecte proprement
    if (event === 'TOKEN_REFRESHED' && !session) {
      supabase.auth.signOut();
    }
    setSession(session);
  });

  return () => subscription.unsubscribe();
}, []);

  return { session, loading };
}