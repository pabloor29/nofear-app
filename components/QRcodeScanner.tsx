import { CameraType, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";

const QRcodeScanner = () => {
  const [facing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const router = useRouter();

  const handleBarCodeScanned = ({ data }: any) => {
    if (scanned) return;

    setScanned(true);
    setCameraActive(false); // 🔥 on démonte la caméra immédiatement

    let parsed;
    try {
      parsed = JSON.parse(data);
    } catch (error) {
      Alert.alert("QR Code invalide", "Le contenu n’est pas lisible.", [
        {
          text: "OK",
          onPress: () => {
            setScanned(false);
            setCameraActive(true);
          },
        },
      ]);
      return;
    }

    if (parsed?.company === "no-fear") {
      router.replace({
        pathname: "/new-product",
        params: {
          readDeviceName: parsed["device-name"],
          readDeviceCategory: parsed["device-category"],
          readDeviceCode: parsed["device-code"],
        },
      });
    } else {
      Alert.alert(
        "QR Code invalide",
        "Ce QR code ne correspond pas à un appareil reconnu.",
        [
          {
            text: "OK",
            onPress: () => {
              setScanned(false);
              setCameraActive(true);
            },
          },
        ]
      );
    }
  };

  return (
    <View className="h-[300px] w-[300px]">
      {cameraActive && (
        <CameraView
          className="h-full w-full"
          facing={facing}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View className="h-full w-full flex justify-center items-center">
            <View className="h-[200px] w-[200px] rounded-3xl border-2 border-white" />
          </View>
        </CameraView>
      )}
    </View>
  );
};

export default QRcodeScanner;