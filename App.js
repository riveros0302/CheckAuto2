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
import auth from '@react-native-firebase/auth';
import TestRC from './app/utils/RevenueCat/TestRC';
import TestOBD2 from './app/screens/OBD2/TestOBD2';
import ChatBot from './app/screens/Chats/ChatBot';

LogBox.ignoreLogs(['Setting a timer']);

export default function App() {
  const [user, setUser] = useState();
  const [userGoogle, setUserGoogle] = useState();
  const toastRef = useRef();
  const [blockAds, setBlockAds] = useState(false);

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

  useEffect(() => {}, [user, userGoogle]);

  // return <ChatBot />;

  return (
    <>
      <StatusBar
        style='dark'
        barStyle={'light-content'}
        backgroundColor={'black'}
      />

      {userGoogle || user ? (
        <RevenueCatProvider>
          <NavigationContainer>
            <Navigation
              user={user}
              setUser={setUser}
              userGoogle={userGoogle}
              setUserGoogle={setUserGoogle}
              toastRef={toastRef}
              blockAds={blockAds}
              setBlockAds={setBlockAds}
            />
          </NavigationContainer>
        </RevenueCatProvider>
      ) : (
        <NavigationContainer>
          <NavigationLogin
            user={user}
            setUser={setUser}
            setUserGoogle={setUserGoogle}
            toastRef={toastRef}
          />
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
