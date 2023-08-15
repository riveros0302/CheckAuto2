import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../../components/Account/LoginForm';
import { primary, background } from '../../utils/tema';

export default function Login({ setUser, toastRef }) {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={background} // Ruta de la imagen de fondo
      style={styles.backgroundImage}
    >
      <ScrollView>
        <View style={styles.viewContainer}>
          <LoginForm setUser={setUser} toastRef={toastRef} />
          <CrearCuenta navigation={navigation} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function CrearCuenta(props) {
  const { navigation } = props;
  return (
    <Text>
      ¿Aun no tienes una cuenta?{' '}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate('register')}
      >
        Registrate
      </Text>
    </Text>
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
    color: primary,
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
});
