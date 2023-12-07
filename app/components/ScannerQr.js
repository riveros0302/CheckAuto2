import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Linking } from "react-native";
import { Button } from "react-native-elements";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useNavigation } from "@react-navigation/native";
import { primary } from "../utils/tema";

export default function ScannerQr() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);

    setScannedData({ type, data });
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para acceder a la cámara</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se concedió acceso a la cámara</Text>;
  }

  const pressLink = () => {
    Linking.openURL(scannedData.data);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, { backgroundColor: "black" }]}
      />
      <View style={{ marginTop: 350 }}>
        {scanned && (
          <Button
            title={"Escanear de nuevo"}
            onPress={() => setScanned(false)}
            buttonStyle={styles.btnScan}
          />
        )}
        {scannedData && (
          <View style={styles.viewTxt}>
            <Text style={styles.txtLink} onPress={pressLink}>
              {" "}
              {scannedData.data}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  btnScan: {
    borderRadius: 30,
    backgroundColor: primary,
  },
  txtLink: {
    color: "white",
    alignSelf: "center",
    marginHorizontal: 20,
  },
  viewTxt: {
    top: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    width: "90%",
  },
});
