import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Icon, Input } from 'react-native-elements';
import Loading from '../../components//Loading';
import { background, primary, secondary } from '../../utils/tema';
import MenuFlotante from '../../components/MenuFlotante';
import Titulo from '../../components/Titulo';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
var pkg = require('../../../app.json');
import { useRevenueCat } from '../../utils/RevenueCat/RevenueCatProvider';
import Modal from '../../components/Modal';
import { privacidad } from '../../utils/politicas';

export default function Ajustes({ setUser }) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { restorePermissions, logoutRC } = useRevenueCat();
  const [isVisible, setIsVisible] = useState(false);

  const signOut = async () => {
    try {
      setLoading(true);
      await auth().signOut();

      // Si el cierre de sesión en Firebase es exitoso, entonces se procede a cerrar la sesión en RevenueCat
      await logoutRC();

      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser();
    } catch (error) {
      console.log('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const callPolitics = () => {
    setIsVisible(true);
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
                value={auth().currentUser ? auth().currentUser.displayName : ''}
                labelStyle={styles.lbl}
                style={styles.value}
                editable={false}
              />
              <Input
                label='Correo Electronico'
                value={auth().currentUser ? auth().currentUser.email : ''}
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
          <TouchableOpacity style={styles.viewContainer} onPress={callPolitics}>
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
              <Text style={styles.txt2}>Version {pkg.expo.version}</Text>
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
          <Button
            title={'Restaurar Suscripción'}
            onPress={restorePermissions}
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
              color: secondary,
              fontWeight: 'bold',
              marginVertical: 15,
              textAlign: 'center',
            }}
          >
            UID: {auth().currentUser ? auth().currentUser.uid : ''}
          </Text>
        </ScrollView>

        <Loading isVisible={loading} text='Cerrando sesión' />
        <Politicas
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          privacidad={privacidad}
        />
      </ImageBackground>
    </View>
  );
}

function Politicas(props) {
  const { isVisible, setIsVisible, privacidad } = props;
  console.log(privacidad);
  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      colorModal={'white'}
      close={false}
    >
      <ScrollView style={{ height: '75%' }}>
        <Text style={styles.titlePolitics}>Politicas de Privacidad</Text>
        <Text style={styles.politics}>{privacidad}</Text>
      </ScrollView>
      <Button
        title={'Aceptar'}
        buttonStyle={{ marginTop: 20, borderRadius: 30 }}
        onPress={() => setIsVisible(false)}
      />
    </Modal>
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
  titlePolitics: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 15,
  },
  politics: {
    fontSize: 15,
    marginHorizontal: 20,
    textAlign: 'justify',
  },
});
