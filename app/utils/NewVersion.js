import { StyleSheet, Text, View, Linking } from 'react-native';
import { Button, Image } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { botoncolor } from '../utils/tema';
import React, { useEffect } from 'react';
var pkg = require('../../app.json');

const CURRENT_APP_VERSION = pkg.expo.version; // Versión actual de tu aplicación

export default function NewVersion(props) {
  const { setShowModal } = props;

  useEffect(() => {
    checkForUpdate();
  }, []);

  const fetchLatestAppVersion = async () => {
    try {
      const docRef = await firestore()
        .collection('setting')
        .doc('i9IpCZ8jhZ5Hya35pD0l')
        .get();

      if (docRef.exists) {
        const versionInfo = docRef.data();
        return versionInfo.newVersion;
      } else {
        console.log('No se encontró el documento en la colección.');
        return null;
      }
    } catch (error) {
      console.log('Error getting version info:', error.message);
      return null;
    }
  };

  const checkForUpdate = async () => {
    try {
      // Obtener la última versión de la app desde Firebase o tu servidor
      const latestAppVersion = await fetchLatestAppVersion(); // Implementa esta función según tu lógica

      console.log('ultima version en firebase: ' + latestAppVersion);

      if (latestAppVersion && latestAppVersion > CURRENT_APP_VERSION) {
        // Mostrar un aviso de actualización al usuario
        setShowModal(true);
      } else {
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al verificar la actualización:', error);
    }
  };

  const goPlayStore = () => {
    // Redirigir al usuario a la Play Store para actualizar la aplicación
    Linking.openURL('market://details?id=com.riveros0302.CheckAuto2');
  };

  return (
    <View>
      <Image
        source={require('../../assets/LOGO.png')}
        style={{
          height: 200,
          width: 'auto',
          alignSelf: 'center',
          marginTop: 30,
          marginBottom: -30,
        }}
      />
      <Text
        style={{
          color: 'white',
          width: '85%',
          marginBottom: 20,
          alignSelf: 'center',
          fontWeight: 'bold',
          textAlign: 'justify',
        }}
      >
        Hay una nueva version de la aplicacion, usted nunca jamas sea tonto
      </Text>
      <Button
        title='Actualizar'
        onPress={goPlayStore}
        buttonStyle={{
          width: '50%',
          alignSelf: 'center',
          borderRadius: 50,
          backgroundColor: botoncolor,
          marginBottom: 15,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
