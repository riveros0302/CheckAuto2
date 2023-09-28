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
import SuscripcionView from '../../components/SuscripcionView';

export default function Suscripcion() {
  return (
    <ImageBackground source={background} style={{ height: '100%' }}>
      <View style={styles.viewContainer}>
        <Image
          source={require('../../../assets/LOGO.png')}
          style={styles.logo}
        />
        <SuscripcionView />
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
