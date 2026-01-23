import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

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
      <Text className="text-2xl font-bold mb-4">Bienvenue !</Text>
      <Text className="text-gray-600 mb-8">Email: {session?.user?.email}</Text>
      
      <TouchableOpacity
        className="bg-red-500 rounded-lg p-4"
        onPress={signOut}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          Se déconnecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}