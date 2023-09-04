import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  LogBox,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './app/navigation/Navigation';
import NavigationLogin from './app/navigation/NavigationLogin';
import Toast from 'react-native-easy-toast';
import * as Notifications from 'expo-notifications';
import { RevenueCatProvider } from './app/utils/RevenueCat/RevenueCatProvider';
import messaging from '@react-native-firebase/messaging';
import TestRC from './app/utils/RevenueCat/TestRC';
import TestOBD2 from './app/screens/OBD2/TestOBD2';

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  const [user, setUser] = useState();
  const toastRef = useRef();

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log(token);
        });
    } else {
      console.log('Failed token status: ' + authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state: ' +
              remoteMessage.notification
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state: ' +
          remoteMessage.notification
      );
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }, []);

  /*  useEffect(() => {
    // Solicitar permiso para enviar notificaciones
    const getNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('No se otorgó el permiso para recibir notificaciones.');
      } else {
        scheduleMonthlyNotification();
      }
    };

    getNotificationPermission();
  }, []);

  const scheduleMonthlyNotification = () => {
    // Calcular la fecha y hora para el próximo mes
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Cambio de aceite',
        body: 'Recuerda revisar el kilometraje de tu vehiculo para realizarle el cambio de aceite.',
      },
      trigger: {
        seconds: 600, //igual a 10 sminutos
        repeats: true,
      },
    });
  };*/

  return (
    <>
      <StatusBar style='auto' />

      {user ? (
        <RevenueCatProvider>
          <NavigationContainer>
            <Navigation user={user} setUser={setUser} toastRef={toastRef} />
          </NavigationContainer>
        </RevenueCatProvider>
      ) : (
        <NavigationContainer>
          <NavigationLogin setUser={setUser} toastRef={toastRef} />
        </NavigationContainer>
      )}
      <Toast
        ref={toastRef}
        position='bottom'
        style={styles.backToast}
        textStyle={styles.txttoast}
      />
    </>
  );
  // return <TestOBD2 />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
