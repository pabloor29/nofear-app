import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/use-profile";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { t } from "@/constants/translations";
import { Language, Theme, useAppSettings } from "@/context/app-settings";

export default function EditProfile() {
  const { profile, loading } = useProfile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { language, theme, setLanguage, setTheme } = useAppSettings();

  const { bg, text, textSecondary, border, card } = useThemeStyles();

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
  }, [profile]);

  if (loading) return <ActivityIndicator className="flex-1 mt-20" />;

  const handleSave = async () => {
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        alert("Session expirée, veuillez vous reconnecter.");
        setSaving(false);
        return;
    }

    const { error } = await supabase
        .from('profiles')
        .update({ first_name: firstName, last_name: lastName })
        .eq('id', session.user.id);

    if (error) {
        alert("Erreur : " + error.message);
    } else {
        router.back(); // retourne vers settings qui va refetch grâce au useFocusEffect
    }
    setSaving(false);
    };

  return (
    <View 
      className="flex-1 pt-20 px-6"
      style={bg}
    >
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
        <Text className="text-mainColor font-SpaceGroteskBold">← {t[language].returnButton}</Text>
      </TouchableOpacity>

      <Text 
        className="text-2xl font-VictorMonoBold mb-8"
        style={text}
      >
        {t[language].myInformationsLabel}
      </Text>

      <Text 
        className="font-SpaceGroteskBold text-gray-700 mb-1"
        style={text}
      >
        {t[language].firstName}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        style={[text , border]}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Prénom"
      />

      <Text 
        className="font-SpaceGroteskBold text-gray-700 mb-1"
        style={text}
      >
        {t[language].lastName}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        style={[text , border]}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Nom"
      />

      <TouchableOpacity
        className="bg-mainColor rounded-lg p-4"
        onPress={handleSave}
        disabled={saving}
      >
        <Text className="text-white text-center font-VictorMonoBold">
          {saving ? t[language].saveButtonPending : t[language].saveButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
}