import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

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
};

const stateLabel = (code: number) => {
  if (code === 99) return { label: "Création", color: "text-blue-500" };
  if (code === 1) return { label: "Fermé", color: "text-green-500" };
  if (code === 0) return { label: "Ouvert", color: "text-red-500" };
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

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

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
  if (!product) return <Text className="p-6">Produit introuvable.</Text>;

  const history = product.state?.history ?? [];

  return (
    <ScrollView className="flex-1 bg-white pt-20 px-6">
      <Pressable onPress={() => router.back()} className="mb-6">
        <Text className="text-mainColor font-SpaceGroteskBold">← Retour</Text>
      </Pressable>

      <Text className="text-2xl font-VictorMonoBold mb-8">
        Détail du produit
      </Text>

      {/* Champs modifiables */}
      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">Nom</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        value={name}
        onChangeText={setName}
      />

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">Adresse</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        value={street}
        onChangeText={setStreet}
      />

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">
        Code postal
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        value={zipcode}
        onChangeText={setZipcode}
      />

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">Ville</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        value={city}
        onChangeText={setCity}
      />

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">Pays</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 mb-4 font-SpaceGroteskRegular"
        value={country}
        onChangeText={setCountry}
      />

      {/* Champs non modifiables */}
      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">
        Catégorie
      </Text>
      <View className="border border-gray-100 bg-gray-50 rounded-lg p-3 mb-4">
        <Text className="text-gray-400 font-SpaceGroteskRegular">
          {product.category}
        </Text>
      </View>

      <Text className="font-SpaceGroteskBold text-gray-700 mb-1">
        Clé de sécurité
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
        <Text className="text-white text-center font-SpaceGroteskBold">
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </Text>
      </Pressable>

      {/* Historique */}
      <Text className="text-xl font-VictorMonoBold mb-4">Historique</Text>

      {history.length === 0 ? (
        <Text className="text-gray-400 font-SpaceGroteskRegular mb-10">
          Aucun historique.
        </Text>
      ) : (
        [...history].reverse().map((entry, index) => {
          const { label, color } = stateLabel(entry.code);
          return (
            <View
              key={index}
              className="flex-row justify-between items-center border-b border-gray-100 py-3"
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
