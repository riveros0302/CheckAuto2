import React, { useState, useEffect } from "react";
import { ImageBackground, StyleSheet, View, Alert } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import Loading from "../Loading";
import { validateEmail } from "../../utils/validations";
import { size, isEmpty } from "lodash";
import { primary, background, botoncolor } from "../../utils/tema";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { addDataToUser } from "../../utils/Database/users";
import MenuFlotante from "../MenuFlotante";
import CrearCuenta from "./CrearCuenta";

export default function RegisterForm({ toastRef, setIsRegister, setUser }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const actionCodeSettings = {
    url: "https://checkauto2.page.link/home",
    handleCodeInApp: true,
  };

  const onSubmit = async () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      toastRef.current.show("Todos los campos son obligatorios");
      console.log("todos los campos son obligatirios");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El email no es correcto");
      console.log("mail incorrecto");
    } else if (formData.password !== formData.repeatPassword) {
      toastRef.current.show("Las contraseñas tienen que ser iguales");
      console.log("password diferentes");
    } else if (size(formData.password) < 6) {
      toastRef.current.show(
        "La contraseña tiene que tener al menos 6 caracteres"
      );
      console.log("password menor a 6");
    } else {
      setLoading(true);
      setIsRegister(true);
      await auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(async (credential) => {
          credential.user.updateProfile({
            displayName: formData.nombre,
          });

          auth()
            .currentUser.sendEmailVerification(actionCodeSettings)
            .then(() => {
              //setUser(auth().currentUser);
              navigation.navigate("login");

              Alert.alert(
                "Verificar Correo electrónico",
                `Hemos enviado un correo a ${formData.email}`,
                [
                  {
                    text: "Ok",
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            })
            .catch((err) => {
              Alert.alert("Error: " + err.message);
              console.log("ERROR: " + err);
            });

          setLoading(false);

          toastRef.current.show("Usuario registrado correctamente");
        })
        .then(async () => {
          await addDataToUser(formData.nombre);
        })
        .catch((err) => {
          setLoading(false);
          toastRef.current.show("El email ya esta en uso, pruebe con otro");
          console.log("Fallo al registrar: " + err);
        });
    }
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <ImageBackground style={styles.backgroundImage} source={background}>
      <View style={styles.formContainer}>
        <Input
          placeholder="Nombre"
          placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
          containerStyle={styles.inputForm}
          onChange={(e) => onChange(e, "nombre")}
          inputStyle={{ color: "white" }}
          rightIcon={
            <Icon
              type="material-community"
              name="account"
              iconStyle={styles.iconRight}
            />
          }
        />
        <Input
          placeholder="Correo electronico"
          keyboardType="email-address"
          placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
          containerStyle={styles.inputForm}
          inputStyle={{ color: "white" }}
          onChange={(e) => onChange(e, "email")}
          rightIcon={
            <Icon
              type="material-community"
              name="at"
              iconStyle={styles.iconRight}
            />
          }
        />
        <Input
          placeholder="Contraseña"
          containerStyle={styles.inputForm}
          placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
          inputStyle={{ color: "white" }}
          password={true}
          secureTextEntry={showPassword ? false : true}
          onChange={(e) => onChange(e, "password")}
          rightIcon={
            <Icon
              type="material-community"
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              iconStyle={styles.iconRight}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <Input
          placeholder="Repetir contraseña"
          containerStyle={styles.inputForm}
          placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
          inputStyle={{ color: "white" }}
          password={true}
          secureTextEntry={showRepeatPassword ? false : true}
          onChange={(e) => onChange(e, "repeatPassword")}
          rightIcon={
            <Icon
              type="material-community"
              name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
              iconStyle={styles.iconRight}
              onPress={() => setShowRepeatPassword(!showRepeatPassword)}
            />
          }
        />

        <Button
          title="Crear Cuenta"
          containerStyle={styles.btnContainerRegister}
          buttonStyle={styles.btnRegister}
          onPress={onSubmit}
        />
        <Loading isVisible={loading} text="Creando cuenta" />
      </View>
    </ImageBackground>
  );
}

function defaultFormValue() {
  return {
    nombre: "",
    email: "",
    password: "",
    repeatPassword: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    width: "85%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    height: "60%",
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: botoncolor,
    borderRadius: 50,
  },
  iconRight: {
    color: "white",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ajusta la imagen al tamaño del componente
    justifyContent: "center",
  },
});
