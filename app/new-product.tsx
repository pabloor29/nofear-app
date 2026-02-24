import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { t } from "@/constants/translations";
import { useAppSettings } from "@/context/app-settings";

export default function ProductCreator({ session }: { session: Session }) {
  const { readDeviceName, readDeviceCategory, readDeviceCode } =
    useLocalSearchParams();

  const [creating, setCreating] = useState(false);

  const { bg, text, textSecondary, border, card } = useThemeStyles();
  const { language, theme, setLanguage, setTheme } = useAppSettings();

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
        {t[language].newProductTitle}
      </Text>
      <View className="w-full mb-12">
        <View className="w-full">
          <Text 
            className="font-SpaceGroteskBold mb-1"
            style={text}
          >
            {t[language].newProductName}
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
            {t[language].newProductCategory}
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
          <View 
            className="border rounded-lg p-3"
            style={border}
          >
            <Text 
              className="font-SpaceGroteskBold mb-1"
              style={text}
            >
              {t[language].newProductInfos}
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
            {creating ? t[language].createButton : t[language].createButton}
          </Text>
        </Pressable>
        <Link href={"/(tabs)/add"} asChild>
          <Pressable className="rounded-lg p-4 border border-mainColor">
            <Text className="text-mainColor text-center font-VictorMonoBold">
              {t[language].cancelButton}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
