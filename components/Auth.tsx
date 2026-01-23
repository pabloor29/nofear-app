import { useState } from 'react';
import { Alert, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else Alert.alert('Vérifiez votre email pour confirmer votre inscription !');
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-center">NoFear App</Text>
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6"
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      
      <TouchableOpacity
        className="bg-blue-500 rounded-lg p-4 mb-3"
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          Se connecter
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className="border border-blue-500 rounded-lg p-4"
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text className="text-blue-500 text-center font-semibold">
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}