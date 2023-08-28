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
import { secondary } from '../utils/tema';
import { useRevenueCat } from '../utils/RevenueCat/RevenueCatProvider';
import Purchases from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';

export default function BotonSuscripcion(props) {
  const [planSelected, setPlanSelected] = useState(0);
  const { selectedIndex, idSub, tiempo, titulo, packages, setReload } = props;
  const { user, purchasePackage, restorePermissions } = useRevenueCat();
  const [paquete, setPaquete] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const firstPackage = packages.availablePackages[idSub];
    setPaquete(firstPackage);

    Purchases.addCustomerInfoUpdateListener(async (info) => {
      //updateCustomerInformation(info);
      navigation.navigate('home');
      setReload(false);
    });
  }, [idSub]);

  const onPurchase = (pack) => {
    // Purchase the package
    purchasePackage(pack);
    setPlanSelected(1);
    setReload(true);
  };

  return (
    <TouchableOpacity
      style={styles.botonTouch}
      key={paquete?.identifier}
      onPress={() => onPurchase(paquete)}
    >
      <View style={styles.viewBoton}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.txt1}>{titulo}</Text>
          <Text style={styles.txt1}>
            {paquete?.product.priceString}/{tiempo}
          </Text>
          <Text style={styles.txt2}>{paquete?.product.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botonTouch: {
    borderWidth: 5,
    borderColor: secondary,
    borderRadius: 50,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
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
