import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Principal from '../screens/Home/Principal';
import { primary, secondary } from '../utils/tema';
import { Icon } from 'react-native-elements';
import Identification from '../screens/MisDocumentos/Identification';
import Auto from '../screens/InformacionAuto/Auto';
import Alarma from '../screens/Alarmas/Alarma';
import ShowPDF from '../components/ShowPDF';
import Todos from '../screens/Autos/Todos';
import Suscripcion from '../screens/Account/Suscripcion';
import Ajustes from '../screens/Account/Ajustes';

const Stack = createStackNavigator();

export default function Navigation({ user, setUser }) {
  return (
    <Stack.Navigator
      initialRouteName='home'
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Stack.Screen name='home' options={{ headerShown: false }}>
        {({ route }) => (
          <Principal route={route} user={user} setUser={setUser} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name='Mis Documentos'
        component={Identification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Mi Auto'
        component={Auto}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Mi Alarma'
        component={Alarma}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='add-document'
        component={ShowPDF}
        options={{ headerShown: false }}
      />
      <Stack.Screen name='Mis Ajustes' options={{ headerShown: false }}>
        {() => <Ajustes setUser={setUser} />}
      </Stack.Screen>
      <Stack.Screen
        name='todos'
        component={Todos}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='suscripcion'
        component={Suscripcion}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
