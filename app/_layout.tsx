import { AppSettingsProvider, useAppSettings } from '@/context/app-settings';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { View, Image, useColorScheme } from 'react-native';
import { useSession } from '@/hooks/use-session';
import "./global.css";

function ThemedApp() {
  const { theme } = useAppSettings();
  const systemColorScheme = useColorScheme();
  const { session, loading } = useSession();
  const router = useRouter();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

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

  const activeTheme =
    theme === 'system' ? systemColorScheme :
    theme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    const timer = setTimeout(() => setMinLoadingDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!fontsLoaded || loading || !minLoadingDone) return;
    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)');
    }
  }, [session, loading, fontsLoaded, minLoadingDone]);

  if (!fontsLoaded || loading || !minLoadingDone) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F2F2' }}>
        <Image
          source={require('@/assets/images/logo/logo-001.png')}
          style={{ width: 150, height: 150, resizeMode: 'contain' }}
        />
      </View>
    );
  }

  return (
    <ThemeProvider value={activeTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="new-product" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="edit-profile" />
      </Stack>
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <ThemedApp />
    </AppSettingsProvider>
  );
}