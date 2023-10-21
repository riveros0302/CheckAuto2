import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../../components/Account/LoginForm';
import { primary, background } from '../../utils/tema';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ setUser, toastRef }) {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const [visible, setVisible] = useState(true);

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
    <ImageBackground
      source={background} // Ruta de la imagen de fondo
      style={styles.backgroundImage}
    >
      <ScrollView>
        <View style={styles.viewContainer}>
          <LoginForm
            setUser={setUser}
            toastRef={toastRef}
            visible={visible}
            checked={checked}
          />
          {visible && (
            <CrearCuenta
              navigation={navigation}
              handleCheckboxPress={handleCheckboxPress}
              checked={checked}
            />
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function CrearCuenta(props) {
  const { navigation, handleCheckboxPress, checked } = props;
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
  viewContainer: {
    marginRight: 40,
    marginLeft: 40,
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  btnRegister: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: primary,
    margin: 40,
  },
  back: {
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ajusta la imagen al tamaño del componente
    justifyContent: 'center',
  },
  viewCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
});
