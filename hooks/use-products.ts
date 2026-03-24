import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "./use-session";

type StateEntry = {
  code: number;
  date: string;
};

type Product = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  security_key: string;
  street: string;
  zipcode: string;
  city: string;
  country: string;
  state: { history: StateEntry[] } | null;
  last_update: string;
  created_date: string;
};

export function useProducts() {
  const { session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!session) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("id, user_id, name, category, security_key, street, zipcode, city, country, state, last_update, created_date")
      .eq("user_id", session.user.id)
      .order("created_date", { ascending: false });

    if (!error && data) setProducts([...data]);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (!session) return;

    fetchProducts();

    const subscription = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [session, fetchProducts]);

  return { products, loading, refetch: fetchProducts };
}