import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { t } from "@/constants/translations";
import { useAppSettings } from "@/context/app-settings";

const DELAY_OPTIONS = [
  { label: "10 secondes", value: 10 },
  { label: "30 secondes", value: 30 },
  { label: "1 minute", value: 60 },
  { label: "2 minutes", value: 120 },
  { label: "5 minutes", value: 300 },
  { label: "10 minutes", value: 600 },
  { label: "15 minutes", value: 900 },
  { label: "30 minutes", value: 1800 },
];

export default function ProductCreator({ session }: { session: Session }) {
  const { readDeviceName, readDeviceCategory, readDeviceCode } = useLocalSearchParams();

  const [creating, setCreating] = useState(false);
  const [delayPickerOpen, setDelayPickerOpen] = useState(false);

  const { bg, text, border } = useThemeStyles();
  const { language } = useAppSettings();

  const [deviceName, setDeviceName] = useState<string>(
    Array.isArray(readDeviceName) ? readDeviceName[0] : readDeviceName || ""
  );
  const [deviceCode, setDeviceCode] = useState<string>(
    Array.isArray(readDeviceCode) ? readDeviceCode[0] : readDeviceCode || ""
  );
  const [deviceCategory, setDeviceCategory] = useState<string>(
    Array.isArray(readDeviceCategory) ? readDeviceCategory[0] : readDeviceCategory || ""
  );

  const [deviceAddress, setDeviceAddress] = useState<string>();
  const [deviceCity, setDeviceCity] = useState<string>();
  const [deviceZipCode, setDeviceZipCode] = useState<string>();
  const [deviceCountry, setDeviceCountry] = useState<string>();
  const [notificationDelay, setNotificationDelay] = useState(300);

  const handleCreate = async () => {
    setCreating(true);
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !currentSession) {
      alert("Session expirée, veuillez vous reconnecter");
      setCreating(false);
      return;
    }

    const initialState = {
      history: [{ code: 99, date: new Date().toISOString() }],
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
        notification_delay: notificationDelay,
      },
    ]);

    if (error) {
      alert("Erreur lors de la création : " + error.message);
    } else {
      alert("Produit créé avec succès !");
      router.push("/(tabs)");
    }
    setCreating(false);
  };

  return (
    <View className="h-screen w-screen pt-20 px-6 items-center" style={bg}>
      <Text className="text-2xl font-SpaceGroteskBold mb-12" style={text}>
        {t[language].newProductTitle}
      </Text>

      <View className="w-full mb-12">
        <Text className="font-SpaceGroteskBold mb-1" style={text}>
          {t[language].newProductName}
        </Text>
        <TextInput
          className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
          style={[text, border]}
          value={deviceName}
          onChangeText={setDeviceName}
          placeholder="My QR door handle"
        />

        <Text className="font-SpaceGroteskBold mb-1" style={text}>
          {t[language].newProductCategory}
        </Text>
        <TextInput
          className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
          style={[text, border]}
          value={deviceCategory}
          onChangeText={setDeviceCategory}
          placeholder="Track serrure"
        />

        <View className="border rounded-lg p-3 mb-4" style={border}>
          <Text className="font-SpaceGroteskBold mb-1" style={text}>
            {t[language].newProductInfos}
          </Text>
          <TextInput
            className="border-b-2 w-full pl-2 py-2 mb-2 font-SpaceGroteskRegular"
            style={text}
            value={deviceAddress}
            onChangeText={setDeviceAddress}
            placeholder="Adress"
          />
          <TextInput
            className="border-b-2 w-full pl-2 py-2 mb-2 font-SpaceGroteskRegular"
            style={text}
            value={deviceCity}
            onChangeText={setDeviceCity}
            placeholder="City"
          />
          <TextInput
            className="border-b-2 w-full pl-2 py-2 mb-2 font-SpaceGroteskRegular"
            style={text}
            value={deviceZipCode}
            onChangeText={setDeviceZipCode}
            placeholder="Zip code"
          />
          <TextInput
            className="border-b-2 w-full pl-2 py-2 mb-2 font-SpaceGroteskRegular"
            style={text}
            value={deviceCountry}
            onChangeText={setDeviceCountry}
            placeholder="Country"
          />
        </View>

        {/* Délai de notification */}
        <Text className="font-SpaceGroteskBold mb-1" style={text}>
          Délai de notification
        </Text>
        <Pressable
          className="border rounded-lg p-3 flex-row justify-between items-center"
          style={border}
          onPress={() => setDelayPickerOpen(true)}
        >
          <Text className="font-SpaceGroteskRegular" style={text}>
            {DELAY_OPTIONS.find((o) => o.value === notificationDelay)?.label ?? "5 minutes"}
          </Text>
          <Text className="text-gray-400">▼</Text>
        </Pressable>

        <Modal visible={delayPickerOpen} transparent animationType="fade">
          <Pressable
            className="flex-1 bg-black/40 justify-center px-6"
            onPress={() => setDelayPickerOpen(false)}
          >
            <View className="rounded-xl overflow-hidden" style={bg}>
              {DELAY_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  className="p-4 border-b border-gray-100 flex-row justify-between items-center"
                  onPress={() => {
                    setNotificationDelay(option.value);
                    setDelayPickerOpen(false);
                  }}
                >
                  <Text className="font-SpaceGroteskRegular" style={text}>
                    {option.label}
                  </Text>
                  {notificationDelay === option.value && (
                    <Text className="text-mainColor font-SpaceGroteskBold">✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>

      <View className="flex flex-col w-full gap-4">
        <Pressable
          className="bg-mainColor py-3 rounded-lg"
          onPress={handleCreate}
          disabled={creating}
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