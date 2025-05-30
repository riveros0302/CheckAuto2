import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Icon, Input } from "react-native-elements";
import Loading from "../../components//Loading";
import { background, primary, secondary } from "../../utils/tema";
import MenuFlotante from "../../components/MenuFlotante";
import Titulo from "../../components/Titulo";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
var pkg = require("../../../app.json");
import { useRevenueCat } from "../../utils/RevenueCat/RevenueCatProvider";
import Modal from "../../components/Modal";
import { privacidad } from "../../utils/politicas";
import SuscripcionView from "../../components/SuscripcionView";
import { deleteUserAccount, reauthenticate } from "../../utils/Database/auto";
import { addFeedbackToUser } from "../../utils/Database/users";
import { useNavigation } from "@react-navigation/native";
import PoliticasyUso from "../../utils/Politics";

export default function Ajustes({
  setUser,
  setUserGoogle,
  userGoogle,
  user,
  toastRef,
  blockAds,
}) {
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { logoutRC, idSubs } = useRevenueCat();
  const [isVisibleServicio, setIsVisibleServicio] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ModalDeleteAcc, setModalDeleteAcc] = useState(false);
  const [reauthModal, setReauthModal] = useState(false); //muestra el modal de password
  const [password, setPassword] = useState(""); //sirve para agregar la contraseña del usuario al eliminar cuenta
  const [txtLoad, setTxtLoad] = useState("Cerrando Sesión");
  const [text, setText] = useState("");
  const [txtInfoSuscription, setTxtInfoSuscription] =
    useState("Contratar plan");
  const [details, setDetails] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    switch (idSubs) {
      case "pp_android:pp1m":
        setTxtInfoSuscription("Plan Pro I /Mes");
        setDetails("Puedes registrar hasta 3 vehículos");
        break;
      case "po_android:po1m":
        setTxtInfoSuscription("Plan Pro II /Mes");
        break;
      case "ppt_android:ppt1m":
        setTxtInfoSuscription("Plan Pro III /Mes");
        break;
      case "pp_android:pp1a":
        setTxtInfoSuscription("Plan Pro I /Año");
        setDetails("Puedes registrar hasta 3 vehículos");
        break;
      case "po_android:po1a":
        setTxtInfoSuscription("Plan Pro II /Año");
        break;
      case "ppt_android:ppt1a":
        setTxtInfoSuscription("Plan Pro III /Año");
        break;

      default:
        break;
    }
  }, []);

  const signOut = async () => {
    console.log("QUE TRAE USERGOOGLE: " + JSON.stringify(userGoogle));
    try {
      if (userGoogle) {
        setTxtLoad("Cerrando Sesión...");
        setLoading(true);
        await auth().signOut();

        // Si el cierre de sesión en Firebase es exitoso, entonces se procede a cerrar la sesión en RevenueCat
        await logoutRC();

        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setUserGoogle();
      } else {
        setTxtLoad("Cerrando Sesión...");
        setLoading(true);
        await auth().signOut();
        // Si el cierre de sesión en Firebase es exitoso, entonces se procede a cerrar la sesión en RevenueCat
        await logoutRC();
        setUser();
        console.log("Cerrar sesion normal sin google");
      }
    } catch (error) {
      console.log("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    addFeedbackToUser(text)
      .then(async () => {
        setTxtLoad("Eliminando Cuenta...");
        setLoading(true);

        await deleteUserAccount(userGoogle, setUserGoogle, setUser, navigation)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(async () => {
            await signOutDelete();
          });
      })
      .catch((err) => {
        console.log("ERROR AL AGREGAR EL MENSAJE AL FEEDBACK");
      });
  };

  const signOutDelete = async () => {
    setLoading(false);
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };

  const callPolitics = () => {
    navigation.navigate("politics");
  };

  const callService = () => {
    navigation.navigate("terms");
  };

  const reauthenticate = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signInSilently();
      console.log("Usuario reautenticado:", userInfo);
      // Realizar acciones adicionales con la información del usuario
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        console.log("Se requiere autenticación:", error);
        // Implementa aquí la lógica para que el usuario se autentique nuevamente
      } else {
        console.error("Error al reautenticar:", error);
        // Otro manejo de errores
      }
    }
  };

  const checkifGoogleLogin = () => {
    if (userGoogle) {
      console.log("llamar a login de google");
      reauthenticate();
      setModalDeleteAcc(true);
    } else {
      setReauthModal(true);
    }
  };

  return (
    <View>
      <ImageBackground source={background} style={{ height: "100%" }}>
        <MenuFlotante isSetting={true} />
        <Titulo title={"AJUSTES"} />
        <ScrollView>
          <View style={styles.viewContainer}>
            <View style={{ marginTop: 25 }}>
              <Input
                label="Nombre Usuario"
                value={auth().currentUser ? auth().currentUser.displayName : ""}
                labelStyle={styles.lbl}
                style={styles.value}
                editable={false}
              />
              <Input
                label="Correo Electronico"
                value={auth().currentUser ? auth().currentUser.email : ""}
                labelStyle={styles.lbl}
                style={styles.value}
                editable={false}
              />

              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 20,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text style={styles.txt}>Suscripción</Text>
                  <Text style={styles.txtvalue}>{txtInfoSuscription}</Text>
                </View>
                <Button
                  title={"CAMBIAR"}
                  containerStyle={styles.btnContainer}
                  buttonStyle={styles.btn}
                  titleStyle={styles.titlebtn}
                  onPress={() => setShowModal(true)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.viewContainer} onPress={callPolitics}>
            <View style={styles.viewRow}>
              <Text style={styles.txt}>Politicas de Privacidad</Text>
              <Icon
                type="material-community"
                name="check"
                color={"green"}
                size={30}
                style={{ marginRight: 20 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.viewContainer} onPress={callService}>
            <View style={styles.viewRow}>
              <Text style={styles.txt}>Términos y condiciones</Text>
              <Icon
                type="material-community"
                name="check"
                color={"green"}
                size={30}
                style={{ marginRight: 20 }}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.viewContainer}>
            <View style={{ marginVertical: 15 }}>
              <Text style={styles.txt}>Acerca de</Text>
              <Text style={styles.txt2}>CheckAuto </Text>
              <Text style={styles.txt2}>Desarrollado por Teom Apps{"\n"} </Text>
              <Text style={styles.txt2}>Version {pkg.expo.version}</Text>
            </View>
          </View>
          <Button
            title={"Cerrar Sesión"}
            onPress={signOut}
            containerStyle={{
              borderRadius: 10,
              width: "90%",
              alignSelf: "center",
            }}
            titleStyle={{
              fontWeight: "bold",
              fontSize: 20,
              color: "black",
            }}
            buttonStyle={{ backgroundColor: "white" }}
          />
          <Button
            title={"Eliminar Cuenta"}
            onPress={checkifGoogleLogin}
            containerStyle={{
              borderRadius: 10,
              width: "90%",
              alignSelf: "center",
              marginTop: 18,
            }}
            titleStyle={{
              fontWeight: "bold",
              fontSize: 20,
              color: "red",
            }}
            buttonStyle={{ backgroundColor: "white" }}
          />

          <Text
            style={{
              color: secondary,
              fontWeight: "bold",
              marginVertical: 15,
              textAlign: "center",
            }}
          >
            UID: {auth().currentUser ? auth().currentUser.uid : ""}
          </Text>
        </ScrollView>

        <Loading isVisible={loading} text={txtLoad} />

        <Servicios
          isVisible={isVisibleServicio}
          setIsVisible={setIsVisibleServicio}
          privacidad={privacidad}
        />
        <Suscripciones
          showModal={showModal}
          setShowModal={setShowModal}
          idSubs={idSubs}
          blockAds={blockAds}
        />
        <DeleteAcc
          ModalDeleteAcc={ModalDeleteAcc}
          setModalDeleteAcc={setModalDeleteAcc}
          deleteAccount={deleteAccount}
          setText={setText}
          text={text}
        />
        <Reauth
          reauthModal={reauthModal}
          setReauthModal={setReauthModal}
          setPassword={setPassword}
          password={password}
          setModalDeleteAcc={setModalDeleteAcc}
          deleteAccount={deleteAccount}
          toastRef={toastRef}
        />
      </ImageBackground>
    </View>
  );
}

function Reauth(props) {
  const {
    reauthModal,
    setReauthModal,
    setPassword,
    password,
    setModalDeleteAcc,
    toastRef,
  } = props;

  const [errorPass, setErrorPass] = useState(false);
  const [loadingbtn, setLoadingbtn] = useState(false);

  const closeOpenModal = () => {
    setLoadingbtn(true);
    reauthenticate(password)
      .then(async () => {
        setReauthModal(false);
        setModalDeleteAcc(true);
        setLoadingbtn(false);
        setPassword("");
      })
      .catch((err) => {
        console.log("ERROR AL REACUTENTICAR" + err);
        setErrorPass(true);
        setLoadingbtn(false);
        setPassword("");
      });
  };

  return (
    <Modal
      isVisible={reauthModal}
      setIsVisible={setReauthModal}
      colorModal={"white"}
      close={true}
    >
      <Text style={styles.titleDelete}>
        Ingresa tu contraseña antes de continuar
      </Text>
      <Input
        password={true}
        secureTextEntry={true}
        placeholder="Contraseña"
        value={password}
        onChangeText={(value) => setPassword(value)}
        errorMessage={errorPass ? "¡Clave incorrecta!" : null}
        containerStyle={{ top: 20 }}
        textContentType="none" //para que no muestre sugerencias de autollenado con claves almacenadas en el dispositivo
      />

      <Button
        title={"Confirmar"}
        disabled={password == "" ? true : false}
        buttonStyle={styles.btnDeleteAcc}
        titleStyle={{ marginHorizontal: 10 }}
        onPress={closeOpenModal}
        loading={loadingbtn}
      />
    </Modal>
  );
}

function DeleteAcc(props) {
  const { ModalDeleteAcc, setModalDeleteAcc, deleteAccount, text, setText } =
    props;

  return (
    <Modal
      isVisible={ModalDeleteAcc}
      setIsVisible={setModalDeleteAcc}
      colorModal={"white"}
      close={true}
    >
      <Text style={styles.titleDelete}>
        ¿Realmente quieres eliminar la cuenta?
      </Text>
      <Text style={styles.descDelete}>
        Al eliminar tu cuenta se eliminarán todos tus datos incluyendo
        documentos que hayas subido a checkAuto ¿Estás seguro que quieres
        eliminar esta cuenta?
      </Text>
      <View>
        <Input
          multiline={true}
          numberOfLines={4} // Puedes ajustar este número según sea necesario
          onChangeText={(value) => setText(value)}
          value={text}
          placeholder="¿Porque quieres eliminar tu cuenta?"
          inputStyle={{ height: 150, fontSize: 15 }} // Altura mínima del cuadro de texto
          textAlignVertical="top"
          inputContainerStyle={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "gray", // Color del nuevo borde añadido
            paddingHorizontal: 5, // Espaciado horizontal para el borde
            backgroundColor: "transparent", // Hacer el fondo transparente
            top: 30,
          }}
        />
        <Button
          title={"Eliminar Cuenta"}
          disabled={text == "" ? true : false}
          buttonStyle={styles.btnDeleteAcc}
          titleStyle={{ marginHorizontal: 10 }}
          onPress={deleteAccount}
        />
      </View>
    </Modal>
  );
}

function Suscripciones(props) {
  const { showModal, setShowModal, idSubs, blockAds } = props;
  const { packages } = useRevenueCat();
  return (
    <Modal
      isVisible={showModal}
      setIsVisible={setShowModal}
      colorModal={"white"}
      close={true}
    >
      <SuscripcionView
        idSubs={idSubs ? idSubs : null}
        isSetting={true}
        blockAds={blockAds}
      />
    </Modal>
  );
}

function Servicios(props) {
  const { isVisible, setIsVisible, privacidad } = props;

  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      colorModal={"white"}
      close={false}
    >
      <ScrollView style={{ height: "75%" }}>
        <Text style={styles.titlePolitics}>Condiciones de servicio</Text>
        <Text style={styles.politics}>{privacidad}</Text>
      </ScrollView>
      <Button
        title={"Aceptar"}
        buttonStyle={{ marginTop: 20, borderRadius: 30 }}
        onPress={() => setIsVisible(false)}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: "white",
    marginHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  lbl: {
    fontSize: 20,
    marginLeft: 10,
  },
  value: {
    color: "grey",
    marginLeft: 10,
  },
  txt: {
    color: "#959595",
    fontSize: 21,
    fontWeight: "bold",
    marginLeft: 20,
  },
  txtvalue: {
    color: "#959595",
    fontSize: 20,
    marginTop: 8,
    marginLeft: 20,
  },
  btnContainer: {
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 35,
    height: 50,
    marginRight: 20,
  },
  btn: {
    borderRadius: 25,
    backgroundColor: "white",
  },
  titlebtn: {
    color: "#959595",
    fontWeight: "bold",
  },
  viewRow: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  txt2: {
    color: "grey",
    marginLeft: 20,
    fontSize: 18,
  },
  titlePolitics: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  politics: {
    fontSize: 15,
    marginHorizontal: 20,
    textAlign: "justify",
  },
  titleDelete: {
    fontWeight: "bold",
    color: primary,
    fontSize: 20,
    textAlign: "center",
  },
  descDelete: {
    color: "grey",
    width: "90%",
    textAlign: "justify",
    alignSelf: "center",
    fontSize: 15,
    top: 10,
  },
  btnDeleteAcc: {
    backgroundColor: primary,
    alignSelf: "flex-end",
    borderRadius: 30,
    marginVertical: 15,
    top: 10,
  },
});
