import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "./global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFonts } from "expo-font";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

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

  if (!fontsLoaded) return;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
