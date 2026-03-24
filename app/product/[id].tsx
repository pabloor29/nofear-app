import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useThemeStyles } from "@/hooks/use-theme-styles";
import { t } from "@/constants/translations";
import { useAppSettings } from "@/context/app-settings";

type StateEntry = {
  code: number;
  date: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  security_key: string;
  street: string;
  zipcode: string;
  city: string;
  country: string;
  state: { history: StateEntry[] } | null;
  notification_delay: number;
};

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

const stateLabel = (code: number) => {
  if (code === 0) return { label: "Fermé", color: "text-green-500" };
  if (code === 1) return { label: "Ouvert", color: "text-red-500" };
  return { label: "Inconnu", color: "text-gray-400" };
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR") + " à " + d.toLocaleTimeString("fr-FR");
};

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [delayPickerOpen, setDelayPickerOpen] = useState(false);

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [notificationDelay, setNotificationDelay] = useState(300);

  const { bg, text, border } = useThemeStyles();
  const { language } = useAppSettings();

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProduct(data);
          setName(data.name || "");
          setStreet(data.street || "");
          setZipcode(data.zipcode || "");
          setCity(data.city || "");
          setCountry(data.country || "");
          setNotificationDelay(data.notification_delay ?? 300);
        }
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update({
        name,
        street,
        zipcode,
        city,
        country,
        notification_delay: notificationDelay,
        last_update: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Erreur : " + error.message);
    } else {
      alert("Produit mis à jour !");
      router.back();
    }
    setSaving(false);
  };

  if (loading) return <ActivityIndicator className="flex-1 mt-20" />;
  if (!product) return <Text className="p-6">{t[language].productNotFound}</Text>;

  const history = product.state?.history ?? [];
  const creationEntry = history.find((e) => e.code === 99);
  const stateHistory = history.filter((e) => e.code !== 99);

  return (
    <ScrollView className="flex-1 pt-20 px-6" style={bg}>
      <Pressable onPress={() => router.back()} className="mb-6">
        <Text className="text-mainColor font-SpaceGroteskBold">← {t[language].returnButton}</Text>
      </Pressable>

      <Text className="text-2xl font-VictorMonoBold mb-8" style={text}>
        {t[language].tileEditProduct}
      </Text>

      {/* Date de création */}
      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].creationDate}
      </Text>
      <View className="border border-gray-100 bg-gray-50 rounded-lg p-3 mb-6">
        <Text className="text-gray-500 font-SpaceGroteskRegular">
          {creationEntry ? formatDate(creationEntry.date) : "Non disponible"}
        </Text>
      </View>

      {/* Champs modifiables */}
      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productName}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        style={[text, border]}
        value={name}
        onChangeText={setName}
      />

      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productAddress}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        style={[text, border]}
        value={street}
        onChangeText={setStreet}
      />

      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productZipCode}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        style={[text, border]}
        value={zipcode}
        onChangeText={setZipcode}
      />

      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productCity}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        style={[text, border]}
        value={city}
        onChangeText={setCity}
      />

      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productCountry}
      </Text>
      <TextInput
        className="border rounded-lg p-3 mb-6 font-SpaceGroteskRegular"
        style={[text, border]}
        value={country}
        onChangeText={setCountry}
      />

      {/* Délai de notification */}
      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        Délai de notification
      </Text>
      <Pressable
        className="border rounded-lg p-3 mb-6 flex-row justify-between items-center"
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

      {/* Champs non modifiables */}
      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productCategory}
      </Text>
      <View className="border border-gray-100 bg-gray-50 rounded-lg p-3 mb-4">
        <Text className="text-gray-400 font-SpaceGroteskRegular">{product.category}</Text>
      </View>

      <Text className="font-SpaceGroteskBold mb-1" style={text}>
        {t[language].productSecurityKey}
      </Text>
      <View className="border border-gray-100 bg-gray-50 rounded-lg p-3 mb-8">
        <Text className="text-gray-400 font-SpaceGroteskRegular">••••••••</Text>
      </View>

      {/* Bouton sauvegarder */}
      <Pressable
        className="bg-mainColor py-3 rounded-lg mb-10"
        onPress={handleSave}
        disabled={saving}
      >
        <Text className="text-clearColor text-center font-VictorMonoBold">
          {saving ? t[language].saveButtonPending : t[language].saveButton}
        </Text>
      </Pressable>

      {/* Historique */}
      <Text className="text-xl font-VictorMonoBold mb-4" style={text}>
        {t[language].productHistoric}
      </Text>

      {stateHistory.length === 0 ? (
        <Text className="text-gray-400 font-SpaceGroteskRegular mb-10">
          {t[language].productNoHistoric}
        </Text>
      ) : (
        [...stateHistory].reverse().map((entry, index) => {
          const { label, color } = stateLabel(entry.code);
          return (
            <View
              key={index}
              className="flex-row justify-between items-center border-b py-3"
              style={[bg, border]}
            >
              <Text className={`font-SpaceGroteskBold ${color}`}>{label}</Text>
              <Text className="text-gray-400 font-SpaceGroteskRegular text-sm">
                {formatDate(entry.date)}
              </Text>
            </View>
          );
        })
      )}

      <View className="mb-20" />
    </ScrollView>
  );
}