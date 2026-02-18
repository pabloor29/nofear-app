import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSession } from "@/hooks/use-session";
import { useFonts } from "expo-font";

import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const router = useRouter();

  const { session, loading } = useSession();

  const [fontsLoaded] = useFonts({
    PoiretOneRegular: require("@/assets/fonts/Poiret_One/PoiretOne-Regular.ttf"),
    SpaceGroteskBold: require("@/assets/fonts/Space_Grotesk_text/static/SpaceGrotesk-Bold.ttf"),
    SpaceGroteskLight: require("@/assets/fonts/Space_Grotesk_text/static/SpaceGrotesk-Light.ttf"),
    SpaceGroteskMedium: require("@/assets/fonts/Space_Grotesk_text/static/SpaceGrotesk-Medium.ttf"),
    SpaceGroteskRegular: require("@/assets/fonts/Space_Grotesk_text/static/SpaceGrotesk-Regular.ttf"),
    SpaceGroteskSemiBold: require("@/assets/fonts/Space_Grotesk_text/static/SpaceGrotesk-SemiBold.ttf"),
    VictorMonoBold: require("@/assets/fonts/Victor_Mono_titre/static/VictorMono-Bold.ttf"),
    VictorMonoRegular: require("@/assets/fonts/Victor_Mono_titre/static/VictorMono-Regular.ttf"),
    VictorMonoLight: require("@/assets/fonts/Victor_Mono_titre/static/VictorMono-Light.ttf"),
    VictorMonoMedium: require("@/assets/fonts/Victor_Mono_titre/static/VictorMono-Medium.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded || loading) return;

    if (session) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)");
    }
  }, [session, loading, fontsLoaded]);

  if (!fontsLoaded) return;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
