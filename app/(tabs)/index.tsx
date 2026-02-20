import { Session } from "@supabase/supabase-js";
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View, RefreshControl, Pressable } from "react-native";
import { supabase } from "../../lib/supabase";
import { useProducts } from '@/hooks/use-products';
import { LockOpen, Lock, HelpCircle } from "lucide-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useThemeStyles } from "@/hooks/use-theme-styles";

type StateEntry = {
  code: number;
  date: string;
};

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const { products, loading, refetch } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { bg, text, textSecondary, border, card } = useThemeStyles();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) return null;

  const StateIcon = ({ state }: { state: { history: StateEntry[] } | null }) => {
    if (!state?.history?.length) return <HelpCircle size={24} color="gray" />;
    
    const lastCode = state.history[state.history.length - 1].code;

    if (lastCode === 1) return <Lock size={24} color="green" />;
    if (lastCode === 0) return <LockOpen size={24} color="red" />;
    return <HelpCircle size={24} color="gray" />;
  };
  return (
    <View 
      className="flex-1 pt-20 p-6 bg-white"
      style={bg}
    >
      <Text 
        className="text-2xl font-VictorMonoBold mb-6"
        style={text}
      >
        Mes produits
      </Text>

      {loading && !refreshing ? (
        <ActivityIndicator />
      ) : products.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Text 
                className="text-gray-400 font-SpaceGroteskRegular"
                style={text}
              >
                Aucun produit détecté...
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <Pressable
              className="border border-gray-200 rounded-lg p-4 mb-3 flex-row justify-between items-center"
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <View className="flex-1">
                <Text 
                  className="text-lg font-SpaceGroteskBold"
                  style={text}
                >
                  {item.name}
                </Text>
                <Text 
                  className="font-SpaceGroteskRegular"
                  style={text}
                >
                  {item.category}
                </Text>
                {item.city && (
                  <Text 
                    className="text-gray-400 font-SpaceGroteskRegular text-sm mt-1"
                    style={text}
                  >
                    {item.street}, {item.zipcode} {item.city}, {item.country}
                  </Text>
                )}
              </View>
              <StateIcon state={item.state} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}