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

  const fetchProfile = async () => {
    if (!session) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!error && data) setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  return { profile, loading, refetch: fetchProfile };
}