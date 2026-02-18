import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import { useProfile } from '@/hooks/use-profile';

export default function Account({ session }: { session: Session }) {
  const [loadingSession, setLoadingSession] = useState(false);
  const { profile, loading } = useProfile();

  if (loading) return <ActivityIndicator />;

  async function signOut() {
    setLoadingSession(true);
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
    setLoadingSession(false);
  }

  return (
    <View className="flex-1 justify-between pt-20 p-6 bg-white">
      <View>
        <View className="flex flex-row items-center mb-4">
          <Text className="text-2xl text-darkColor font-SpaceGroteskBold pr-2">
            Bienvenue,
          </Text>
          <Text className="text-2xl text-darkColor font-SpaceGroteskBold">
            {profile?.first_name}
          </Text>
        </View>
          <Text className="text-darkColor font-VictorMonoRegular mb-8">
            Email: {session?.user?.email}
          </Text>
      </View>

      <TouchableOpacity
        className="bg-mainColor rounded-lg p-4"
        onPress={signOut}
        disabled={loadingSession}
      >
        <Text className="text-clearColor text-center font-VictorMonoBold">
          Se déconnecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}
