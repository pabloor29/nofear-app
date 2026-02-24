import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { Home, PlusCircle, CircleUser } from "lucide-react-native";
import { t } from "@/constants/translations";
import { useAppSettings } from "@/context/app-settings";

export default function TabLayout() {
  const { isDark } = useThemeStyles();
  const insets = useSafeAreaInsets();

  const tint = isDark ? "#F8F2F2" : "#1B110E";
  const background = isDark ? "#1B110E" : "#F8F2F2";
  const border = isDark ? "#374151" : "#e5e7eb";

  const { language, theme, setLanguage, setTheme } = useAppSettings();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: isDark ? "#9ca3af" : "#6b7280",

        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: border,
          borderTopWidth: 1,
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom,
        },

        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarIconStyle: {
          marginTop: 4,
        },

        tabBarLabelStyle: {
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t[language].homeLabel,
          tabBarIcon: ({ color }) => (
            <View pointerEvents="none">
              <Home size={26} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: t[language].addLabel,
          tabBarIcon: ({ color }) => (
            <View pointerEvents="none">
              <PlusCircle size={26} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t[language].profileLabel,
          tabBarIcon: ({ color }) => (
            <View pointerEvents="none">
              <CircleUser size={26} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}