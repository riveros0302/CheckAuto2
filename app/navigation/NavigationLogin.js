import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "react-native-elements";
import { primary, secondary } from "../utils/tema";
import Principal from "../screens/Home/Principal";
import PoliticasyUso from "../utils/Politics";
import Terms from "../utils/Terms";
import RegisterForm from "../components/Account/RegisterForm";
import Login from "../screens/Account/Login";

const Stack = createStackNavigator();

export default function NavigationLogin({
  setUser,
  toastRef,
  setUserGoogle,
  user,
}) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Stack.Screen name="login" options={{ headerShown: false }}>
        {() => (
          <Login
            user={user}
            setUser={setUser}
            toastRef={toastRef}
            setUserGoogle={setUserGoogle}
            isRegister={isRegister}
            setIsRegister={setIsRegister}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="politics"
        component={PoliticasyUso}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="terms"
        component={Terms}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="register-form" options={{ headerShown: false }}>
        {() => (
          <RegisterForm
            setUser={setUser}
            toastRef={toastRef}
            isRegister={isRegister}
            setIsRegister={setIsRegister}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
