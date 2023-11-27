import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import LoginForm from "../../components/Account/LoginForm";
import { primary, background } from "../../utils/tema";

export default function Login({
  setUser,
  toastRef,
  setUserGoogle,
  isRegister,
  setIsRegister,
  user,
  isvisible,
  setVisible,
  checked,
  setChecked,
}) {
  return (
    <ImageBackground
      source={background} // Ruta de la imagen de fondo
      style={styles.backgroundImage}
    >
      <View>
        <View style={{ top: 50 }}>
          <LoginForm
            setUser={setUser}
            toastRef={toastRef}
            setUserGoogle={setUserGoogle}
            isRegister={isRegister}
            setIsRegister={setIsRegister}
            user={user}
            isvisible={isvisible}
            setVisible={setVisible}
            checked={checked}
            setChecked={setChecked}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },

  divider: {
    backgroundColor: primary,
    margin: 40,
  },
  back: {
    height: "100%",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ajusta la imagen al tamaño del componente
    justifyContent: "center",
  },
});
