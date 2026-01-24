import QRcodeScanner from "@/components/QRcodeScanner";
import { Session } from "@supabase/supabase-js";
import { useCameraPermissions } from "expo-camera";
import { Link, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Add() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (!session) {
    return (
      <View className="flex-1 justify-center items-center h-screen w-screen px-6 bg-clearColor">
        <Text className="text-mainColor text-xl font-PoiretOneRegular text-center">
          Create your account to add houses to your profile...
        </Text>
        <Link href={"/"} asChild>
          <Pressable className="bg-mainColor py-3 rounded-xl mt-12 w-full">
            <Text className="text-clearColor text-center font-SpaceGroteskBold">
              Create my account !
            </Text>
          </Pressable>
        </Link>
      </View>
    );
  } else if (!isPermissionGranted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex flex-col justify-center items-center h-screen w-screen bg-clearColor">
        <Text className="text-primaryGreen font-PoiretOneRegular text-xl text-center">
          We need your permission to use the camera...
        </Text>
        <Pressable
          className="bg-mainColor py-2 px-4 rounded-lg mt-4"
          onPress={requestPermission}
        >
          <Text className="text-clearColor text-center font-SpaceGroteskBold">
            Allow NO-FEAR to use my camera
          </Text>
        </Pressable>
        <View className="w-full px-6">
          <Link href={"/"} asChild>
            <Pressable className="bg-primaryGreen py-2 rounded-lg  mt-12">
              <Text className="text-clearColor font-SpaceGroteskBold text-xl text-center">
                Add my house manually !
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  } else {
    return (
      <SafeAreaView className="flex flex-col justify-center items-center h-screen w-screen bg-clearColor">
        <Stack.Screen options={{ title: "Overview", headerShown: false }} />
        <Text className="font-SpaceGroteskBold text-2xl text-mainColor mb-10">
          QR Code Scanner
        </Text>

        <QRcodeScanner />

        <View className="w-full px-6">
          <Link href={"/"} asChild>
            <Pressable className="bg-mainColor py-3 rounded-lg  mt-12">
              <Text className="text-clearColor font-SpaceGroteskBold text-center">
                Add my house manually !
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }
}
