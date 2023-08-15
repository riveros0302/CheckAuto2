import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Account/Login';
import Register from '../screens/Account/Register';

const Stack = createStackNavigator();

export default function AccountStack({ setUser, toastRef }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name='login' options={{ headerShown: false }}>
        {() => <Login setUser={setUser} toastRef={toastRef} />}
      </Stack.Screen>
      <Stack.Screen
        name='register'
        component={Register}
        options={{ title: 'Registro' }}
      />
    </Stack.Navigator>
  );
}
