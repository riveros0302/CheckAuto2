import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Input, Icon, Button, Image } from "react-native-elements";
import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import { primary, botoncolor } from "../../utils/tema";
import { isEmpty } from "lodash";
import { validateEmail } from "../../utils/validations";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { onGoogleButtonPress } from "../../utils/google";
import CrearCuenta from "./CrearCuenta";
import ForgotPassword from "./ForgotPassword";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function LoginForm({
  setUser,
  toastRef,
  setUserGoogle,
  isRegister,
  setIsRegister,
  user,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [hidden, setHidden] = useState(false);
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [logedNormal, setLogedNormal] = useState(false);
  const [reloadLogin, setReloadLogin] = useState(false);
  const [isvisible, setVisible] = useState(true);
  const [checked, setChecked] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    //consultar con que se está logueando con google o inicio normal
    console.log("QUE ES LOGEDNORMAL: " + logedNormal);
    if (isRegister) {
      if (user) {
        console.log(JSON.stringify(user));

        if (user.emailVerified) {
          setUser(user);
          console.log("Es login normal y el email esta verificado");
        } else {
          console.log("el email no esta verificado");
          toastRef.current.show(
            `¡Porfavor verifica tu correo electrónico!`,
            3000
          );
        }
      }
    } else {
      if (!logedNormal) {
        console.log("Es login de google");
        setUserGoogle(user);
      } else {
        if (!isRegister) {
          if (user) {
            console.log(JSON.stringify(user));

            if (user.emailVerified) {
              setUser(user);
              console.log("Es login normal y el email esta verificado");
            } else {
              console.log("el email no esta verificado");
              toastRef.current.show(
                `¡Porfavor verifica tu correo electrónico!`,
                3000
              );
            }
          }
        } else {
          console.log("es registro no se puede iniciar sesion todavia");
        }
      }
    }

    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [isRegister, reloadLogin]);

  const onSubmit = async () => {
    setLogedNormal(true);
    if (auth().currentUser) {
      await auth().currentUser.reload();
      console.log("auth reload listo");
    }

    setReloadLogin(!reloadLogin); //sirve para recargar el onAuthStateChange
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      toastRef.current.show("Todos los campos son obligatorios", 3000);
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El email no es correcto", 3000);
    } else {
      setLoading(true);
      setIsRegister(false); //deshabilitar para poder entrar a la pagina principal

      await auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then((us) => {
          setLoading(false);

          // console.log('usuario: ' + JSON.stringify(us));
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show("Email o contraseña incorrecta", 3000);
        });
    }
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.formContainer}>
      <Image source={require("../../../assets/LOGO.png")} style={styles.logo} />
      <Input
        placeholder="Correo electronico"
        keyboardType="email-address"
        containerStyle={styles.inputForm}
        placeholderTextColor={"rgba(255, 255, 255, 0.5)"}
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

      <Button
        title="Iniciar sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
        disabled={!checked ? true : false}
      />

      <Text
        style={{
          color: "white",
          fontSize: 15,
          fontWeight: "bold",
          marginVertical: 10,
        }}
      >
        O
      </Text>
      <Button
        onPress={() =>
          onGoogleButtonPress(setHidden, toastRef, setLoading, setLogedNormal)
        }
        buttonStyle={styles.btnGoogle}
        containerStyle={styles.containerGoogle}
        disabled={!checked ? true : false}
        icon={
          <View style={styles.buttonContent}>
            <Image
              source={require("../../../assets/google.png")}
              style={styles.icon}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Continuar con Google</Text>
            </View>
          </View>
        }
      />
      {isvisible && (
        <CrearCuenta
          setVisible={setVisible}
          checked={checked}
          setChecked={setChecked}
        />
      )}
      <View style={styles.viewLinks}>
        <ForgotPassword email={formData.email} toastRef={toastRef} />
        <View
          style={{
            flexDirection: "row",
            top: 20,
          }}
        >
          <Text>Aun no tienes una cuenta?</Text>
          <Text
            style={styles.register}
            onPress={() => navigation.navigate("register-form")}
          >
            {" "}
            Regístrate
          </Text>
        </View>
      </View>

      {hidden ? null : <Loading isVisible={loading} text="Iniciando sesión" />}
    </View>
  );
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  logo: {
    height: screenHeight / 4.5,
    width: screenWidth / 1.1,
  },
  formContainer: {
    alignItems: "center",
    width: "85%",
    alignSelf: "center",
    height: screenHeight,
    paddingTop: 50,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    color: "#d3d3d3",
    fontSize: 14,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  inputForm: {
    width: "100%",
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
    borderRadius: 50,
  },
  btnLogin: {
    backgroundColor: botoncolor,
  },
  iconRight: {
    color: "#d9d9d9",
  },
  btnGoogle: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
    height: 60,
    marginBottom: 10,
  },
  icon: {
    marginLeft: 40,
    width: 20,
    height: 20,
  },
  containerGoogle: {
    borderRadius: 10,
  },
  register: {
    color: "white",
    fontWeight: "bold",
  },
  viewLinks: {
    alignItems: "center",
    top: "5%",
  },
});
