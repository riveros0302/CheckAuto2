import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Image, CheckBox } from 'react-native-elements';
import React, { useState } from 'react';
import { background, primary, secondary } from '../../utils/tema';
import BotonSuscripcion from '../../components/BotonSuscripcion';
import Titulo from '../../components/Titulo';
import { useRevenueCat } from '../../utils/RevenueCat/RevenueCatProvider';
import Loading from '../../components/Loading';

export default function Suscripcion() {
  const [selectedIndex, setIndex] = useState(0);
  const [idSub, setIdSub] = useState(0);
  const [tiempo, setTiempo] = useState('Mes');
  const [reload, setReload] = useState(false);

  const { user, packages, purchasePackage, restorePermissions } =
    useRevenueCat();

  const checkPress = (id) => {
    switch (id) {
      case 0:
        setIndex(id);
        setIdSub(0);
        setTiempo('Mes');
        break;
      case 1:
        setIndex(id);
        setIdSub(1);
        setTiempo('Año');
        break;

      default:
        break;
    }
  };

  return (
    <ImageBackground source={background} style={{ height: '100%' }}>
      <View style={styles.viewContainer}>
        <Image
          source={require('../../../assets/LOGO.png')}
          style={styles.logo}
        />
        <View style={styles.viewSubs}>
          <Text style={styles.nombre}>Hazte Pro!</Text>
          <View style={styles.linea} />
          <View style={styles.marginView}></View>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <CheckBox
              checked={selectedIndex === 0}
              onPress={() => checkPress(0)}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
            />
            <Text style={styles.txtCheck}>Mensual</Text>
            <CheckBox
              checked={selectedIndex === 1}
              onPress={() => checkPress(1)}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
            />
            <Text style={styles.txtCheck}>Anual</Text>
          </View>
          <BotonSuscripcion
            selectedIndex={selectedIndex}
            idSub={idSub}
            tiempo={tiempo}
            titulo={'PRO I'}
            packages={packages.default_offering}
            setReload={setReload}
          />
          <BotonSuscripcion
            selectedIndex={selectedIndex}
            idSub={idSub}
            tiempo={tiempo}
            titulo={'PRO II'}
            packages={packages.default_offering_oro}
            setReload={setReload}
          />
          <BotonSuscripcion
            selectedIndex={selectedIndex}
            idSub={idSub}
            tiempo={tiempo}
            titulo={'PRO III'}
            packages={packages.default_offering_platino}
            setReload={setReload}
          />
        </View>
        <Loading isVisible={reload} text='Cargando...' />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 120,
    top: 10,
  },
  viewContainer: {
    alignItems: 'center',
  },
  viewSubs: {
    backgroundColor: 'white',
    width: '89%',
    borderRadius: 30,
  },
  marginView: {
    marginHorizontal: 10,
    marginVertical: 15,
  },
  btn: {
    backgroundColor: primary,
    borderRadius: 30,
    width: '40%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  titleBtn: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  nombre: {
    fontWeight: '900',
    fontSize: 28,
    color: 'black',
    alignSelf: 'center',
    marginTop: 40,
  },
  linea: {
    width: 250,
    height: 3,
    borderRadius: 10,
    backgroundColor: 'red',
    alignSelf: 'center',
  },
  txtCheck: {
    marginRight: 40,
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: secondary,
    marginLeft: -15,
  },
});
