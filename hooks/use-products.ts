import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useSession } from "./use-session";

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
  state: string;
  last_update: string;
  created_date: string;
};

export function useProducts() {
  const { session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!session) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_date", { ascending: false });

    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [session]);

  return { products, loading, refetch: fetchProducts };
}
