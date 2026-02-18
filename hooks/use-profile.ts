import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSession } from './use-session';

type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

export function useProfile() {
  const { session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfile(data);
        setLoading(false);
      });
  }, [session]);

  return { profile, loading };
}