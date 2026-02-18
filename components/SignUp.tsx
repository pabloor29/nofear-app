import { useState } from 'react';
import { Alert, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SignUp({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    // On insère les infos dans une table "profiles"
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id, // clé étrangère vers auth.users
          email,
          first_name: firstName,
          last_name: lastName,
        });

      if (profileError) Alert.alert(profileError.message);
      else Alert.alert('Vérifiez votre email pour confirmer votre inscription !');
    }

    setLoading(false);
  }

  return (
    <View className="p-6 bg-white w-screen h-screen flex-1 justify-center">
      <Text className="text-3xl font-VictorMonoBold mb-8 text-center">NoFear</Text>

      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Prénom"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-4"
        placeholder="Nom"
        value={lastName}
        onChangeText={setLastName}
      />

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
        className="bg-mainColor rounded-lg p-4 mb-3"
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text className="text-white text-center font-SpaceGroteskBold">
          Créer un compte
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="border border-mainColor rounded-lg p-4"
        onPress={onBack}
      >
        <Text className="text-mainColor text-center font-SpaceGroteskBold">
          Déjà un compte ? Se connecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}