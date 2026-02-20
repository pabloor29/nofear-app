import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useThemeStyles } from "@/hooks/use-theme-styles";

export default function ProductCreator({ session }: { session: Session }) {
  const { readDeviceName, readDeviceCategory, readDeviceCode } =
    useLocalSearchParams();

  const [creating, setCreating] = useState(false);
  const { bg, text, textSecondary, border, card } = useThemeStyles();

  const [deviceName, setDeviceName] = useState<string>(
    Array.isArray(readDeviceName) ? readDeviceName[0] : readDeviceName || "",
  );
  const [deviceCode, setDeviceCode] = useState<string>(
    Array.isArray(readDeviceCode) ? readDeviceCode[0] : readDeviceCode || "",
  );
  const [deviceCategory, setDeviceCategory] = useState<string>(
    Array.isArray(readDeviceCategory)
      ? readDeviceCategory[0]
      : readDeviceCategory || "",
  );

  const [deviceAddress, setDeviceAdsress] = useState<string>();
  const [deviceCity, setDeviceCity] = useState<string>();
  const [deviceZipCode, setDeviceZipCode] = useState<string>();
  const [deviceCountry, setDeviceCountry] = useState<string>();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleCreate = async () => {
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !currentSession) {
      alert("Session expirée, veuillez vous reconnecter");
      return;
    }

    // JSON initial lors de la création
    const initialState = {
      history: [
        {
          code: 99,
          date: new Date().toISOString(),
        }
      ]
    };

    const { error } = await supabase.from("products").insert([
      {
        user_id: currentSession.user.id,
        name: deviceName,
        category: deviceCategory,
        security_key: deviceCode,
        street: deviceAddress,
        zipcode: deviceZipCode,
        city: deviceCity,
        country: deviceCountry,
        state: initialState,
      },
    ]);

    if (error) {
      alert("Erreur lors de la création : " + error.message);
    } else {
      alert("Produit créé avec succès !");
      router.push("/(tabs)");
    }
  };

  return (
    <View 
      className="h-screen w-screen pt-20 px-6 items-center justify-cente"
      style={bg}
    >
      <Text 
        className="text-2xl font-SpaceGroteskBold mb-12"
        style={text}
      >
        Connect new No Fear product
      </Text>
      <View className="w-full mb-12">
        <View className="w-full">
          <Text 
            className="font-SpaceGroteskBold mb-1"
            style={text}
          >
            Device name:
          </Text>
          <TextInput
            className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
            style={[text , border]}
            value={deviceName}
            onChangeText={(text) => setDeviceName(text)}
            placeholder="My QR door handle"
          />
        </View>
        <View className="w-full">
          <Text 
            className="font-SpaceGroteskBold mb-1"
            style={text}
          >
            Device category:
          </Text>
          <TextInput
            className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
            style={[text , border]}
            value={deviceCategory}
            onChangeText={(text) => setDeviceCategory(text)}
            placeholder="Track serrure"
          />
        </View>
        <View className="w-full">
          {/* <Text 
            className="font-SpaceGroteskBold mb-1"
            style={text}
          >
            Device security key:
          </Text>
          <View className="flex flex-row justify-between">
            <TextInput
              className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
              style={[text , border]}
              value={deviceCode}
              onChangeText={(text) => setDeviceCode(text)}
              secureTextEntry={!passwordVisible}
              placeholder="MySecurityKey"
            />
            <Pressable
              className="pt-1"
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <Eye size={28} color="#0C1D15" />
              ) : (
                <EyeOff size={28} color="#0C1D15" />
              )}
            </Pressable>
          </View> */}
          <View 
            className="border rounded-lg p-3"
            style={border}
          >
            <Text 
              className="font-SpaceGroteskBold mb-1"
              style={text}
            >
              House&apos;s informations:
            </Text>
            <TextInput
              className="border-b-2 w-full pl-2 py-2 mb-2 text-left font-SpaceGroteskRegular"
              style={text}
              value={deviceAddress}
              onChangeText={(text) => setDeviceAdsress(text)}
              placeholder="Adress"
            />
            <TextInput
              className="border-b-2 w-full pl-2 py-2 mb-2 text-left font-SpaceGroteskRegular"
              style={text}
              value={deviceCity}
              onChangeText={(text) => setDeviceCity(text)}
              placeholder="City"
            />
            <TextInput
              className="border-b-2 w-full pl-2 py-2 mb-2 text-left font-SpaceGroteskRegular"
              style={text}
              value={deviceZipCode}
              onChangeText={(text) => setDeviceZipCode(text)}
              placeholder="Zip code"
            />
            <TextInput
              className="border-b-2 w-full pl-2 py-2 mb-2 text-left font-SpaceGroteskRegular"
              style={text}
              value={deviceCountry}
              onChangeText={(text) => setDeviceCountry(text)}
              placeholder="Country"
            />
          </View>
        </View>
      </View>
      <View className="flex flex-col w-full gap-4">
        <Pressable
          className="bg-mainColor py-3 rounded-lg"
          onPress={handleCreate}
        >
          <Text className="text-clearColor text-center font-VictorMonoBold">
            {creating ? "Création..." : "Créer"}
          </Text>
        </Pressable>
        <Link href={"/(tabs)/add"} asChild>
          <Pressable className="rounded-lg p-4 border border-mainColor">
            <Text className="text-mainColor text-center font-VictorMonoBold">
              Annuler
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
