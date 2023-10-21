import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';
import AccountStack from './AccountStack';
import { primary, secondary } from '../utils/tema';
import Principal from '../screens/Home/Principal';
import PoliticasyUso from '../utils/Politics';
import Terms from '../utils/Terms';

const Stack = createStackNavigator();

export default function NavigationLogin({ setUser, toastRef }) {
  return (
    <Stack.Navigator
      initialRouteName='account'
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Stack.Screen name='account' options={{ headerShown: false }}>
        {() => <AccountStack setUser={setUser} toastRef={toastRef} />}
      </Stack.Screen>
      <Stack.Screen
        name='politics'
        component={PoliticasyUso}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='terms'
        component={Terms}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
