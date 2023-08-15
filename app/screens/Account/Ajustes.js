import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Button, Icon, Input } from 'react-native-elements';
import Loading from '../../components//Loading';
import { background, primary } from '../../utils/tema';
import MenuFlotante from '../../components/MenuFlotante';
import Titulo from '../../components/Titulo';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Ajustes({ setUser }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const signOut = () => {
    setLoading(true);
    auth()
      .signOut()
      .then(async () => {
        console.log('User signed out!');
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setUser();
        setLoading(false);
      });
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <View>
      <ImageBackground source={background} style={{ height: '100%' }}>
        <MenuFlotante isSetting={true} />
        <Titulo title={'AJUSTES'} />
        <ScrollView>
          <View style={styles.viewContainer}>
            <View style={{ marginTop: 25 }}>
              <Input
                label='Nombre Usuario'
                value={auth().currentUser.displayName}
                labelStyle={styles.lbl}
                style={styles.value}
                editable={false}
              />
              <Input
                label='Correo Electronico'
                value={auth().currentUser.email}
                labelStyle={styles.lbl}
                style={styles.value}
                editable={false}
              />

              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 20,
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text style={styles.txt}>Suscripción</Text>
                  <Text style={styles.txtvalue}>Plan Basico</Text>
                </View>
                <Button
                  title={'CAMBIAR'}
                  containerStyle={styles.btnContainer}
                  buttonStyle={styles.btn}
                  titleStyle={styles.titlebtn}
                />
              </View>
            </View>
          </View>
          <View style={styles.viewContainer}>
            <View style={styles.viewRow}>
              <Text style={styles.txt}>Notificaciones</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isEnabled ? primary : '#f4f3f4'}
                ios_backgroundColor='#3e3e3e'
                onValueChange={toggleSwitch} // Asignar la función toggleSwitch al evento onValueChange
                value={isEnabled} // Usar la variable de estado isEnabled como valor del interruptor
                style={{ marginRight: 20 }}
              />
            </View>
          </View>
          <TouchableOpacity style={styles.viewContainer}>
            <View style={styles.viewRow}>
              <Text style={styles.txt}>Politicas de Privacidad</Text>
              <Icon
                type='material-community'
                name='check'
                color={'green'}
                size={30}
                style={{ marginRight: 20 }}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.viewContainer}>
            <View style={{ marginVertical: 15 }}>
              <Text style={styles.txt}>Acerca de</Text>
              <Text style={styles.txt2}>CheckAuto </Text>
              <Text style={styles.txt2}>Desarrollado por TEOMGames{'\n'} </Text>
              <Text style={styles.txt2}>Version 1.0.1</Text>
            </View>
          </View>
          <Button
            title={'Cerrar Sesión'}
            onPress={signOut}
            containerStyle={{
              borderRadius: 10,
              width: '90%',
              alignSelf: 'center',
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'black',
            }}
            buttonStyle={{ backgroundColor: 'white' }}
          />
          <Button
            title={'Eliminar Cuenta'}
            onPress={signOut}
            containerStyle={{
              borderRadius: 10,
              width: '90%',
              alignSelf: 'center',
              marginTop: 18,
            }}
            titleStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: 'red',
            }}
            buttonStyle={{ backgroundColor: 'white' }}
          />
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              marginVertical: 15,
              textAlign: 'center',
            }}
          >
            ID de usuario: {auth().currentUser.uid}
          </Text>
        </ScrollView>

        <Loading isVisible={loading} text='Cerrando sesión' />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  lbl: {
    fontSize: 20,
    marginLeft: 10,
  },
  value: {
    color: 'grey',
    marginLeft: 10,
  },
  txt: {
    color: '#959595',
    fontSize: 21,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  txtvalue: {
    color: '#959595',
    fontSize: 20,
    marginTop: 8,
    marginLeft: 20,
  },
  btnContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 35,
    height: 50,
    marginRight: 20,
  },
  btn: {
    borderRadius: 25,
    backgroundColor: 'white',
  },
  titlebtn: {
    color: '#959595',
    fontWeight: 'bold',
  },
  viewRow: {
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt2: {
    color: 'grey',
    marginLeft: 20,
    fontSize: 18,
  },
});
