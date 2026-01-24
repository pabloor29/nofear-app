import { CameraType, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

const QRcodeScanner = () => {

    const [facing] = useState<CameraType>('back');
    const [scanned, setScanned] = useState(false);
    const router = useRouter();

    const handleBarCodeScanned = ({ data }: any) => 
    {
        setScanned(true);

        let parsed;
        try 
        {
        parsed = JSON.parse(data);
        } 
        catch (error) 
        {
        Alert.alert('QR Code invalide', 'Le contenu n’est pas lisible.', [
            { text: 'OK', onPress: () => setScanned(false) },
        ]);
        return;
        }

        if (parsed?.company === 'qr-code-scanner') 
        {
            router.push({
                pathname: '/',
                params: {
                    readDeviceName: parsed['device-name'],
                    readDeviceCode: parsed['device-code'],
                },
            });
        setTimeout(() => { setScanned(false); }, 500); // évite de rescanner pendant la transition
        } 
        else 
        {
        Alert.alert('QR Code invalide', 'Ce QR code ne correspond pas à un appareil reconnu.', [
            { text: 'OK', onPress: () => setScanned(false) },
        ]);
        }
  };

  return (
    <View className='h-[300px] w-[300px]'>
      <CameraView
        className='h-full w-full'
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View className='h-full w-full flex justify-center items-center'>
          <View className='h-[200px] w-[200px] rounded-3xl border-2 border-white' />
        </View>
      </CameraView>
    </View>
  );
};

export default QRcodeScanner;
