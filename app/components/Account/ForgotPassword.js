import { StyleSheet, Text, View } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";

export default function ForgotPassword({ email, toastRef }) {
  const sendEmailPass = async () => {
    try {
      if (email) {
        await auth().sendPasswordResetEmail(email);
        console.log("Correo para restablecimiento de contraseña enviado");
        // Aquí puedes mostrar un mensaje al usuario indicando que se ha enviado el correo
      } else {
        toastRef.current.show(
          "Indica tu email en el campo Correo electrónico",
          3000
        );
      }
    } catch (error) {
      console.log(
        "Error al enviar el correo de restablecimiento de contraseña:",
        error.message
      );

      toastRef.current.show("Correo electrónico no registrado", 3000);
      // Aquí puedes manejar el error, por ejemplo, mostrando un mensaje al usuario
    }
  };

  return (
    <Text style={styles.pass}>
      ¿Has olvidado tu{" "}
      <Text style={styles.link} onPress={sendEmailPass}>
        contraseña
      </Text>
      ?
    </Text>
  );
}

const styles = StyleSheet.create({
  pass: {
    fontSize: 14,
    top: 5,
  },
  link: {
    fontWeight: "bold",
    color: "white",
  },
});
