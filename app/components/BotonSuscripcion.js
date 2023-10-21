import React, { useEffect, useState } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { secondary, primary } from '../utils/tema';
import { useRevenueCat } from '../utils/RevenueCat/RevenueCatProvider';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

export default function BotonSuscripcion(props) {
  const [planSelected, setPlanSelected] = useState(0);
  const { idSub, tiempo, titulo, packages, setReload, idSubs, isDeleteAds } =
    props;
  const { user, purchasePackage, restorePermissions } = useRevenueCat();
  const [paquete, setPaquete] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const firstPackage = packages.availablePackages[idSub];
    setPaquete(firstPackage);
    Purchases.addCustomerInfoUpdateListener(async (info) => {
      navigation.navigate('home');
      setReload(false);
    });
  }, [idSub]);

  const onPurchase = async (pack) => {
    setReload(true);

    try {
      // Intenta realizar la suscripción
      await purchasePackage(pack);
      setPlanSelected(1);
      setReload(true); // La suscripción se completó con éxito

      // Registra un evento de compra exitosa
      await analytics().logEvent('purchase_success', {
        item_id: pack.identifier,
        item_name: pack.product.title,
        item_price: pack.product.priceString,
        currency: pack.product.currencyCode,
      });
    } catch (error) {
      // Maneja el caso en que la suscripción se cancele o falle
      if (error.code === 'USER_CANCELED') {
        // El usuario canceló la operación de suscripción
        console.log('El usuario canceló la suscripción');
      } else {
        // Maneja otros errores aquí si es necesario
        console.error('Error en la suscripción:', error);
      }
    } finally {
      // Establece subscriptionInProgress en false independientemente del resultado
      setReload(false);
    }
  };

  return (
    <TouchableOpacity
      style={{
        borderWidth: 5,
        borderColor:
          paquete?.product.identifier === idSubs ? primary : secondary,
        borderRadius: 50,
        marginVertical: 10,
        width: '90%',
        alignSelf: 'center',
      }}
      key={paquete?.identifier}
      onPress={() => onPurchase(paquete)}
    >
      <View style={styles.viewBoton}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.txt1}>{titulo}</Text>
          <Text style={styles.txt1}>
            {paquete?.product.priceString}/
            {isDeleteAds ? 'Solo una vez' : tiempo}
          </Text>
          <Text style={styles.txt2}>
            {isDeleteAds
              ? 'Elimina los anuncios molestos para siempre'
              : paquete?.product.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  viewBoton: {
    flexDirection: 'row',
  },
  txt1: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: 18,
  },
  txt2: {
    fontWeight: 'bold',
    color: secondary,
    textAlign: 'center',
  },
});
