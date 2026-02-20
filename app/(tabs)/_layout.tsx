import { Tabs } from "expo-router";
import React from "react";

import { useThemeStyles } from "@/hooks/use-theme-styles";

import { Home, PlusCircle, Settings } from "lucide-react-native";

export default function TabLayout() {
  const { isDark } = useThemeStyles();

  const tint = isDark ? '#F8F2F2' : '#1B110E';
  const background = isDark ? '#1B110E' : '#F8F2F2';
  const border = isDark ? '#374151' : '#e5e7eb';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: background,
          borderTopColor: border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => <PlusCircle size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}