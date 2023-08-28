import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import React, { useEffect } from 'react';
import Purchases from 'react-native-purchases';

export default function TestRC() {
  useEffect(() => {
    Purchases.configure({ apiKey: 'goog_FOixSPjWltjmSBqdxINfstRjZpW' }); // Configura Purchases aquí con tu clave API

    // Resto de tu código de configuración, como configurar listeners, etc.
  }, []);

  const ENTITLEMENT_ID = 'default_offering';
  const pressActive = async () => {
    try {
      // access latest customerInfo
      const customerInfo = await Purchases.getCustomerInfo();

      if (
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined'
      ) {
        console.log(
          'es distino de undefined: ' +
            customerInfo.entitlements.active[ENTITLEMENT_ID]
        );
      } else {
        console.log('Suscripcion.js');
      }
    } catch (e) {
      Alert.alert('Error fetching customer info', e.message);
      console.log(e);
    }
  };
  return (
    <View style={{ marginTop: 50 }}>
      <Text>TestRC</Text>
      <Button title='press' onPress={pressActive} />
    </View>
  );
}

const styles = StyleSheet.create({});
