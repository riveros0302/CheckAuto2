import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CrearCuenta({ setVisible, checked, setChecked }) {
  const navigation = useNavigation();

  useEffect(() => {
    // Verificar si el usuario ya aceptó los términos de uso
    checkTermsAcceptance();
  }, []);

  const checkTermsAcceptance = async () => {
    try {
      const acceptanceStatus = await AsyncStorage.getItem('termsAcceptance');
      if (acceptanceStatus === 'accepted') {
        // Si el usuario ya aceptó los términos, oculta el checkbox y el texto
        setVisible(false);
        setChecked(true);
      }
    } catch (error) {
      console.error('Error checking terms acceptance:', error);
    }
  };

  const handleCheckboxPress = async () => {
    try {
      setChecked(!checked);
      if (!checked) {
        // Guardar el estado de aceptación de términos en AsyncStorage
        await AsyncStorage.setItem('termsAcceptance', 'accepted');
        console.log('accepted');
      } else {
        // Guardar el estado de aceptación de términos en AsyncStorage
        await AsyncStorage.setItem('termsAcceptance', 'cancelled');
        console.log('cancelled');
      }
    } catch (error) {
      console.error('Error saving terms acceptance:', error);
    }
  };

  return (
    <View style={styles.viewCheck}>
      <CheckBox
        checked={checked}
        onPress={handleCheckboxPress}
        checkedColor='white'
      />
      <Text style={{ left: -18 }}>
        Acepto las{' '}
        <Text
          style={styles.btnRegister}
          onPress={() => navigation.navigate('politics')}
        >
          Politicas
        </Text>
        <Text> y </Text>
        <Text
          style={styles.btnRegister}
          onPress={() => navigation.navigate('terms')}
        >
          Condiciones de uso
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btnRegister: {
    color: 'white',
    fontWeight: 'bold',
  },
  viewCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
