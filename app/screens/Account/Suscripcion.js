import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, Image } from 'react-native-elements';
import React from 'react';
import { background, primary } from '../../utils/tema';
import BotonSuscripcion from '../../components/BotonSuscripcion';
import Titulo from '../../components/Titulo';

export default function Suscripcion() {
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
          <View style={styles.marginView}>
            <BotonSuscripcion />
            <BotonSuscripcion />
            <BotonSuscripcion />
          </View>
          <Button
            title={'CONTINUAR'}
            buttonStyle={styles.btn}
            titleStyle={styles.titleBtn}
          />
        </View>
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
});
