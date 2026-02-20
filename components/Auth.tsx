import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import SignUp from "./SignUp";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  if (showSignUp) {
    return <SignUp onBack={() => setShowSignUp(false)} />;
  }

  return (
    <View className="p-6 bg-clearColor w-screen h-screen flex-1 justify-center">
      <Text className="text-3xl font-VictorMonoBold mb-8 text-center">
        NoFear
      </Text>

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">Email</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">
        Mot de passe
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6"
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        className="bg-mainColor rounded-lg p-4 mb-3"
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text className="text-white text-center font-SpaceGroteskBold">
          Se connecter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-mainColor rounded-lg p-4"
        onPress={() => setShowSignUp(true)}
      >
        <Text className="text-mainColor text-center font-SpaceGroteskBold">
          Pas encore de compte ? Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}