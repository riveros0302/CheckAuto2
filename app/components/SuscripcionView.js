import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Image, CheckBox } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { background, primary, secondary } from '../utils/tema';
import BotonSuscripcion from './BotonSuscripcion';
import { useRevenueCat } from '../utils/RevenueCat/RevenueCatProvider';
import Loading from './Loading';

export default function SuscripcionView(props) {
  const { idSubs, isSetting, blockAds } = props;
  const [selectedIndex, setIndex] = useState(0); //este es para el checkbox
  const [idSub, setIdSub] = useState(0);
  const [tiempo, setTiempo] = useState('Mes');
  const [reload, setReload] = useState(false);
  const [titulo, setTitulo] = useState('Hazte Pro!');

  const { user, packages, restorePermissions } = useRevenueCat();

  useEffect(() => {
    if (idSubs) {
      setTitulo('Plan Actual');
    }
  }, []);

  const checkPress = (id) => {
    console.log('PRESSS');
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
    <View style={styles.viewSubs}>
      {/*  <Button
        title={'Restaurar Suscripción'}
        onPress={restorePermissions}
        containerStyle={{
          borderRadius: 50,
          paddingRight: 20,
          marginTop: 5,
          width: '40%',
          alignSelf: 'flex-end',
        }}
        titleStyle={{
          fontSize: 10,
          color: primary,
        }}
        buttonStyle={{ backgroundColor: 'white' }}
      />*/}
      <Text style={styles.nombre}>{titulo}</Text>
      <View style={styles.linea} />
      <View style={styles.marginView}>
        <View style={{ flexDirection: 'row' }}>
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
          idSub={idSub}
          tiempo={tiempo}
          titulo={'PRO I'}
          packages={packages.default_offering}
          setReload={setReload}
          idSubs={idSubs}
          isDeleteAds={false}
        />
        <BotonSuscripcion
          idSub={idSub}
          tiempo={tiempo}
          titulo={'PRO II'}
          packages={packages.default_offering_oro}
          setReload={setReload}
          idSubs={idSubs}
          isDeleteAds={false}
        />
        <BotonSuscripcion
          idSub={idSub}
          tiempo={tiempo}
          titulo={'PRO III'}
          packages={packages.default_offering_platino}
          setReload={setReload}
          idSubs={idSubs}
          isDeleteAds={false}
        />
        {!blockAds && (
          <BotonSuscripcion
            idSub={idSub}
            tiempo={tiempo}
            titulo={'¡Eliminar Anuncios!'}
            packages={packages.default_blok_ads}
            setReload={setReload}
            idSubs={idSubs}
            isDeleteAds={true}
          />
        )}

        <Loading isVisible={reload} text='Cargando...' />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewSubs: {
    backgroundColor: 'white',
    width: '89%',
    borderRadius: 30,
    alignSelf: 'center',
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
