import QRcodeScanner from "@/components/QRcodeScanner";
import { Session } from "@supabase/supabase-js";
import { useCameraPermissions } from "expo-camera";
import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { t } from "@/constants/translations";
import { useAppSettings } from "@/context/app-settings";

export default function Add() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [session, setSession] = useState<Session | null>(null);

  const { bg } = useThemeStyles();
  const { language, theme, setLanguage, setTheme } = useAppSettings();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  
  if (!isPermissionGranted) {
    // Camera permissions are not granted yet.
    return (
      <View 
        className="flex flex-col justify-center items-center h-screen w-screen"
        style={bg}
      >
        <Text className="text-primaryGreen font-PoiretOneRegular text-xl text-center">
          {t[language].cameraNotAllowedLabel}
        </Text>
        <Pressable
          className="bg-mainColor py-2 px-4 rounded-lg mt-4"
          onPress={requestPermission}
        >
          <Text className="text-clearColor text-center font-SpaceGroteskBold">
            {t[language].cameraNotAllowedButton}
          </Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <SafeAreaView 
        className="flex flex-col justify-center items-center h-screen w-scree"
        style={bg}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="font-SpaceGroteskBold text-2xl text-mainColor mb-10">
          QR Code Scanner
        </Text>

        <QRcodeScanner />

      </SafeAreaView>
    );
  }
}
