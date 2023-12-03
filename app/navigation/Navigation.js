import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Principal from "../screens/Home/Principal";
import { primary, secondary } from "../utils/tema";
import { Icon } from "react-native-elements";
import Identification from "../screens/MisDocumentos/Identification";
import Auto from "../screens/InformacionAuto/Auto";
import Alarma from "../screens/Alarmas/Alarma";
import ShowPDF from "../components/ShowPDF";
import Todos from "../screens/Autos/Todos";
import Suscripcion from "../screens/Account/Suscripcion";
import Ajustes from "../screens/Account/Ajustes";
import Home from "../utils/RevenueCat/Home";
import { RevenueCatProvider } from "../utils/RevenueCat/RevenueCatProvider";
import PoliticasyUso from "../utils/Politics";
import Terms from "../utils/Terms";

const Stack = createStackNavigator();

export default function Navigation({
  user,
  setUser,
  toastRef,
  blockAds,
  setBlockAds,
  userGoogle,
  setUserGoogle,
}) {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: secondary,
      })}
    >
      <Stack.Screen name="home" options={{ headerShown: false }}>
        {({ route }) => (
          <Principal
            user={user}
            route={route}
            setUser={setUser}
            userGoogle={userGoogle}
            setUserGoogle={setUserGoogle}
            toastRef={toastRef}
            blockAds={blockAds}
            setBlockAds={setBlockAds}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Mis Documentos" options={{ headerShown: false }}>
        {({ route }) => <Identification blockAds={blockAds} route={route} />}
      </Stack.Screen>
      <Stack.Screen name="Mi Auto" options={{ headerShown: false }}>
        {({ route }) => <Auto blockAds={blockAds} route={route} />}
      </Stack.Screen>
      <Stack.Screen
        name="Mi Alarma"
        component={Alarma}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="add-document" options={{ headerShown: false }}>
        {({ route }) => (
          <ShowPDF route={route} blockAds={blockAds} toastRef={toastRef} />
        )}
      </Stack.Screen>
      <Stack.Screen name="Mis Ajustes" options={{ headerShown: false }}>
        {() => (
          <Ajustes
            user={user}
            setUser={setUser}
            setUserGoogle={setUserGoogle}
            userGoogle={userGoogle}
            toastRef={toastRef}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="todos"
        component={Todos}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="suscripcion"
        component={Suscripcion}
        options={{ headerShown: false }}
      />
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
    </Stack.Navigator>
  );
}
