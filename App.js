import { StyleSheet, Text, View, StatusBar, LogBox } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './app/navigation/Navigation';
import NavigationLogin from './app/navigation/NavigationLogin';
import Toast from 'react-native-easy-toast';
import * as Notifications from 'expo-notifications';

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  const [user, setUser] = useState();
  const toastRef = useRef();

  useEffect(() => {
    // Verificar si 'user' tiene datos antes de cambiar 'isLogged'
    if (user) {
    }
  }, [user]);

  useEffect(() => {
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
        seconds: 1209600, //igual a 2 semanas
        repeats: true,
      },
    });

    console.log('Notificación mensual programada con éxito.');
  };

  return (
    <>
      <StatusBar style='auto' />
      <NavigationContainer>
        {user ? (
          <Navigation user={user} setUser={setUser} />
        ) : (
          <NavigationLogin setUser={setUser} toastRef={toastRef} />
        )}
        <Toast
          ref={toastRef}
          position='bottom'
          style={styles.backToast}
          textStyle={styles.txttoast}
        />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
