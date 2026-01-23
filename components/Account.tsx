import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-2xl text-darkColor font-SpaceGroteskBold mb-4">Bienvenue !</Text>
      <Text className="text-darkColor font-VictorMonoRegular mb-8">Email: {session?.user?.email}</Text>

      <TouchableOpacity
        className="bg-mainColor rounded-lg p-4"
        onPress={signOut}
        disabled={loading}
      >
        <Text className="text-clearColor text-center font-VictorMonoBold">
          Se déconnecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}
