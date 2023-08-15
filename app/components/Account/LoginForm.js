import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Input, Icon, Button, Image } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import Loading from '../Loading';
import { primary } from '../../utils/tema';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { isEmpty } from 'lodash';
import validateEmail from '../../utils/validations';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function LoginForm({ setUser, toastRef }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [hidden, setHidden] = useState(false);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);

  GoogleSignin.configure({
    webClientId:
      '730964090293-j8qde5d3aqe9vv5r1i4d2q2dc0p22n3b.apps.googleusercontent.com',
  });

  const onGoogleButtonPress = async () => {
    setHidden(false); //esto es para que al cancelar el login, el Loading desaparesca
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      // return auth().signInWithCredential(googleCredential);
      const user_sign_in = auth().signInWithCredential(googleCredential);
      user_sign_in
        .then((user) => {
          toastRef.current.show('Hola ' + user.user.displayName, 3000);
        })
        .catch(async (err) => {
          if (err.code === 'auth/user-disabled') {
            toastRef.current.show(
              'Esta cuenta ha sido deshabilitada temporalmente',
              3000
            );
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
          }
          setLoading(false);
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        toastRef.current.show('Inicio de sesión cancelado', 2500);
        setHidden(true);
      }
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View style={styles.formContainer}>
      {/*  <Input
        placeholder='Correo electronico'
        keyboardType='email-address'
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'email')}
        rightIcon={
          <Icon
            type='material-community'
            name='at'
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder='Contraseña'
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={showPassword ? false : true}
        onChange={(e) => onChange(e, 'password')}
        rightIcon={
          <Icon
            type='material-community'
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title='Iniciar sesión'
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={() => {
          checkIfUserExists()
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      />*/}
      <Image
        source={require('../../../assets/LOGO.png')}
        style={styles.logo}
        containerStyle={{ marginTop: -200 }}
      />
      <Button
        onPress={onGoogleButtonPress}
        buttonStyle={styles.btnGoogle}
        containerStyle={styles.containerGoogle}
        icon={
          <View style={styles.buttonContent}>
            <Image
              source={require('../../../assets/google.png')}
              style={styles.icon}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Continuar con Google</Text>
            </View>
          </View>
        }
      />
      {hidden ? null : <Loading isVisible={loading} text='Iniciando sesión' />}
    </View>
  );
}

function defaultFormValue() {
  return {
    email: '',
    password: '',
  };
}

const styles = StyleSheet.create({
  logo: {
    height: screenHeight / 4,
    width: screenWidth,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 350,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#d3d3d3',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  inputForm: {
    width: '100%',
    marginTop: 20,
  },
  btnContainerLogin: {
    marginTop: 20,
    width: '95%',
  },
  btnLogin: {
    backgroundColor: primary,
  },
  iconRight: {
    color: '#d9d9d9',
  },
  btnGoogle: {
    backgroundColor: 'white',
    borderRadius: 30,
    width: '90%',
    height: 60,
    marginBottom: 10,
  },
  icon: {
    marginLeft: 40,
    width: 20,
    height: 20,
  },
  containerGoogle: {
    borderRadius: 10,
  },
});
