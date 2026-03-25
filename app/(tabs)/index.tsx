import { Session } from "@supabase/supabase-js";
import { useEffect, useState, useCallback, useRef } from "react";
import { ActivityIndicator, FlatList, Text, View, RefreshControl, Pressable, Animated, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import { useProducts } from '@/hooks/use-products';
import { LockOpen, Lock, HelpCircle, RotateCcw } from "lucide-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { t } from "@/constants/translations";
import { useAppSettings } from "@/context/app-settings";

type StateEntry = {
  code: number;
  date: string;
};

const StateIcon = ({ state }: { state: { history: StateEntry[] } | null }) => {
  if (!state?.history?.length) return <HelpCircle size={24} color="gray" />;
  
  const lastCode = state.history[state.history.length - 1].code;

  if (lastCode === 0) return <Lock size={24} color="green" />;
  if (lastCode === 1) return <LockOpen size={24} color="red" />;
  return <HelpCircle size={24} color="gray" />;
};

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const { products, loading, refetch } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const { bg, text } = useThemeStyles();
  const { language, theme, setLanguage, setTheme } = useAppSettings();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    rotation.setValue(0);
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ).start();
    await refetch();
    setRefreshing(false);
    rotation.stopAnimation();
    rotation.setValue(0);
  }, [refetch, rotation]);

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

  return (
    <View 
      className="flex-1 pt-20 p-6 bg-white"
      style={bg}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-VictorMonoBold" style={text}>
          {t[language].myProducts}
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          disabled={refreshing}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          style={{ padding: 4 }}
        >
          <Animated.View pointerEvents="none" style={{
            transform: [{
              rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-360deg"] })
            }]
          }}>
            <RotateCcw size={22} color={text.color as string} />
          </Animated.View>
        </TouchableOpacity>
      </View>

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
                {t[language].noProduct}
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          extraData={products}
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