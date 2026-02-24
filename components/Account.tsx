import { Language, Theme, useAppSettings } from "@/context/app-settings";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import { t } from "@/constants/translations";

type Profile = { first_name: string; last_name: string } | null;
type Props = { session: Session; profile: Profile; loading: boolean };

const languages = [
  { value: "fr", label: "🇫🇷 Français" },
  { value: "en", label: "🇬🇧 English" },
];

export default function Account({ session, profile, loading }: Props) {
  const [loadingSession, setLoadingSession] = useState(false);
  const { language, theme, setLanguage, setTheme } = useAppSettings();
  const router = useRouter();
  const { bg, text } = useThemeStyles();

  const tr = t[language];
  const themes = [
    { value: "light", label: tr.lightThemeLabel },
    { value: "dark", label: tr.darkThemeLabel },
    { value: "system", label: tr.systemThemeLabel },
  ];

  async function signOut() {
    setLoadingSession(true);
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
    setLoadingSession(false);
  }

  return (
    <View 
      className="flex-1 pt-20 p-6"
      style={bg}
    >
      {/* Infos utilisateur */}
      <View className="mb-8">
        <View className="flex-row items-center mb-2">
          <Text 
            className="text-2xl font-SpaceGroteskBold pr-2"
            style={text}
          >
            {t[language].welcome},
          </Text>
          <Text 
            className="text-2xl font-SpaceGroteskBold"
            style={text}
          >
            {profile?.first_name}
          </Text>
        </View>
        <Text 
          className="text-darkColor font-VictorMonoRegular"
          style={text}
        >
          {session?.user?.email}
        </Text>
      </View>

      {/* Langue */}
      <Text 
        className="font-SpaceGroteskBold text-gray-700 mb-2"
        style={text}
      >
        {t[language].language}
      </Text>
      <View className="flex-row gap-3 mb-6">
        {languages.map((l) => (
          <TouchableOpacity
            key={l.value}
            onPress={() => setLanguage(l.value as Language)}
            className={`flex-1 py-3 rounded-lg border ${language === l.value ? "bg-mainColor border-mainColor" : "border-gray-300"}`}
          >
            <Text
              className={`text-center font-SpaceGroteskBold ${language === l.value ? "text-clearColor" : "text-gray-600"}`}
              //style={text}
            >
              {l.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Thème */}
      <Text 
        className="font-SpaceGroteskBold text-gray-700 mb-2"
        style={text}
      >
        {t[language].theme}
      </Text>
      <View className="flex-row gap-2 mb-8">
        {themes.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => setTheme(t.value as Theme)}
            className={`flex-1 py-3 rounded-lg border ${theme === t.value ? "bg-mainColor border-mainColor" : "border-gray-300"}`}
          >
            <Text
              className={`text-center font-SpaceGroteskBold text-xs ${theme === t.value ? "text-white" : "text-gray-600"}`}
              // style={text}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Actions */}
      <View className="gap-4 mt-auto">
        <TouchableOpacity
          className="rounded-lg p-4 border border-mainColor"
          onPress={() => router.push("/edit-profile")}
        >
          <Text className="text-mainColor text-center font-VictorMonoBold">
            {t[language].editProfileBUtton}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-mainColor rounded-lg p-4"
          onPress={signOut}
          disabled={loadingSession}
        >
          <Text className="text-clearColor text-center font-VictorMonoBold">
            {t[language].signOutButton}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
