import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  PermissionsAndroid,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import Cuestionario from "./Cuestionario";
import AvatarCar from "../../components/AvatarCar";
import { isEmpty } from "lodash";
import {
  checkIfUserExists,
  getDataCarByUserIdAndIndex,
  getAllDataCarByUserId,
  getLowestIndex,
} from "../../utils/Database/auto";
import Boton from "../../components/Boton";
import BotonFlotante from "../../components/BotonFlotante";
import { background, colorTexto } from "../../utils/tema";
import Loading from "../../components/Loading";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import MenuFlotante from "../../components/MenuFlotante";
import { useRevenueCat } from "../../utils/RevenueCat/RevenueCatProvider";
import Purchases from "react-native-purchases";
import auth from "@react-native-firebase/auth";
import { isDisabledAccount } from "../../utils/google";
import Modal from "../../components/Modal";
import NewVersion from "../../utils/NewVersion";
import Inicio from "./Inicio";
import Banner from "../../components/Ads/Banner";
import { Interstitial, interstitial } from "../../components/Ads/Interstitial";

export default function Principal({
  userGoogle,
  setUserGoogle,
  route,
  toastRef,
  blockAds,
  setBlockAds,
  user,
}) {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState({});
  const [vehiculo, setVehiculo] = useState({});
  // const [user, setUser] = useState(isEmpty(user) ? null : user);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  // const index = !isEmpty(route.params) ? route.params.id : 0;

  const isFocused = useIsFocused(); //usado para refrescar la ventana cada vez que se muestra
  const [addCar, setAddCar] = useState(false);
  const { idSubs, logoutRC } = useRevenueCat();
  const [NumAutos, setNumAutos] = useState(0);
  const [index, setIndex] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isEditIndex, setIsEditIndex] = useState(false); //state para saber si usar 'index' en vez de indexfinal en Cuestionario
  const [tuto, setTuto] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("Principal inicia con " + JSON.stringify(user));
      if (!user.emailVerified) {
        Alert.alert(
          "Verificar Correo electrónico",
          "Por favor verifica tu correo electrónico para no perder tus datos",
          [
            {
              text: "Ok",
              style: "cancel",
            },
          ],
          { cancelable: false }
        );
      }
    }
  }, []);

  useEffect(() => {
    const validarSesion = async () => {
      const result = await isDisabledAccount(setUserGoogle);
      if (result == "Esta cuenta ha sido deshabilitada temporalmente") {
        toastRef.current.show(result, 3000);
        logoutRC();
      } else {
        toastRef.current.show(result, 3000);
      }
    };

    if (userGoogle) {
      // validarSesion();
    }
  }, []);

  useEffect(() => {
    const fetchLowestIndex = async () => {
      try {
        const Lowindex = await getLowestIndex();
        setIndex(!isEmpty(route.params) ? route.params.id : Lowindex);
      } catch (error) {
        console.error("Error fetching lowest index:", error);
      }
    };

    fetchLowestIndex();
  }, [route]);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Permiso de micrófono",
          message:
            "Necesitamos acceder al micrófono para realizar algunas funciones.",
          buttonPositive: "Aceptar",
          buttonNegative: "Cancelar",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permiso de micrófono otorgado");
        // Puedes realizar acciones que requieran acceso al micrófono aquí
      } else {
        console.log("Permiso de micrófono denegado");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //checkear si block-ads esta comprado si esta comprado setBlockAds queda en true para bloquear Banner y Interstitial
  const checkAds = async () => {
    setTimeout(async () => {
      //usamos el Timeout para retrar 1 segundo este codigo para que Purchase sea dsitinto de null
      const { customerInfo } = await Purchases.logIn(auth().currentUser.uid);

      if (customerInfo.entitlements.active["block"]) {
        setBlockAds(true);
        console.log("BLOCK ADS COMPRADO");
      } else {
        console.log("FALTA COMPRAR BLOCK ADS");
      }
    }, 1000);
  };

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      // crearAuto;
      requestMicrophonePermission();

      checkAds();

      const fetchUserId = async () => {
        try {
          const empty = await checkIfUserExists();
          if (!empty) {
            getDataCarByUserIdAndIndex(index).then((res) => {
              setData(res);
              if (!isEmpty(res.url_foto)) {
                setProfile(res.url_foto);
              }
              setTuto(false); // si hay auto registrado, no mostrar introducción
              setLoading(false);
            });
          } else {
            setData({});
            setLoading(false);
          }

          getAllDataCarByUserId().then((res) => {
            setNumAutos(res.length);
          });
        } catch (error) {
          console.log("Error al realizar la consulta:", error);
          setLoading(false);
        }
      };

      fetchUserId();
    }
  }, [index, isFocused, visible]);

  const editCar = () => {
    console.log("QUE RECIBO EN PRINCIPAL: " + JSON.stringify(data));
    setVehiculo(data);
    setAddCar(true);
    setIsUpdate(true); //este state servira para indicarle a firestore que no sume un index sino que lo mantenga ya que es una actualizacion del mismo
    setVisible(true);
    setIsEditIndex(true);
  };

  const pressAdd = async () => {
    setIsUpdate(false); //isUpdate se deja en false para indicarle a firestore o insertCar que aumente en +1 el index o mas bien que no deje el mismo index ya que ahora si es agregar
    //hacemos que cada vez que presione este boton consulte primero se la suscripcion esta activa
    setIsEditIndex(false);
    setVehiculo({});
    const { customerInfo } = await Purchases.logIn(auth().currentUser.uid);

    if (customerInfo.entitlements.active["pro"]) {
      setVisible(true);
      setAddCar(true);
      switch (idSubs) {
        case "pp_android:pp1m" || "pp_android:pp1a":
          if (NumAutos >= 3) {
            console.log("ya tienes 3 vehiculos NumAutos: " + NumAutos);
            toastRef.current.show(
              "Ya has registrado 3 vehiculos, cambiate al plan Pro II",
              3000
            );
            setVisible(false);
            setAddCar(false);
          }
          break;
        case "po_android:po1m" || "po_android:po1a":
          if (NumAutos >= 6) {
            console.log("ya tienes 6 vehiculos: " + NumAutos);
            toastRef.current.show(
              "Ya has registrado 6 vehiculos, cambiate al plan Pro III",
              3000
            );
            setVisible(false);
            setAddCar(false);
          }
          break;
        case "ppt_android:ppt1m" || "ppt_android:ppt1a":
          if (NumAutos >= 12) {
            console.log("ya tienes 12 vehiculos: " + NumAutos);
            toastRef.current.show("Ya has registrado 12 vehiculos", 3000);
            setVisible(false);
            setAddCar(false);
          }
          break;

        default:
          break;
      }
    } else {
      navigation.navigate("suscripcion", { blockAds });
    }

    //navigation.navigate('borrar');
  };

  return (
    <View style={styles.vertical}>
      {tuto && <Inicio setTuto={setTuto} />}

      <ImageBackground source={background} style={{ height: "100%" }}>
        <MenuFlotante
          main={true}
          data={data}
          isPDF={false}
          toastRef={toastRef}
          interstitial={interstitial}
          blockAds={blockAds}
        />
        <Interstitial />
        <View style={styles.viewperfil}>
          <AvatarCar
            profile={profile}
            setProfile={setProfile}
            vehiculo={vehiculo}
            setVehiculo={setVehiculo}
            index={index}
          />
          <Text style={styles.nombre}>{data.Marca}</Text>
          <View style={styles.linea} />
          <View style={styles.perfilhzt}>
            <Text style={styles.subtitle}> {data.Modelo} </Text>
            <Text style={styles.subtitle}>{data.Año}</Text>
          </View>

          <View style={styles.container}>
            <Boton
              icono={require("../../../assets/Iconos/MENU1.png")}
              item="auto"
              titulo="GENERAL"
              data={data}
              index={index}
              isPrincipal={true}
            />
            <Boton
              icono={require("../../../assets/Iconos/DOCUMENTOS.png")}
              item="id"
              titulo="DOCUMENTOS"
              data={data}
              index={index}
              isPrincipal={true}
              blockAds={blockAds}
            />
          </View>
          <View style={styles.container}>
            <Boton
              icono={require("../../../assets/Iconos/ALARMAS.png")}
              item="alarma"
              titulo="NOTIFICACIONES"
              index={index}
              isPrincipal={true}
              blockAds={blockAds}
            />
            <Boton
              icono={require("../../../assets/Iconos/AJUSTES.png")}
              item="ajustes"
              titulo="AJUSTES"
              isPrincipal={true}
            />
          </View>
          <BotonFlotante
            source={require("../../../assets/Iconos/AGREGAR.png")}
            posicion={"center"}
            onpress={pressAdd}
          />
          <BotonFlotante
            source={require("../../../assets/Iconos/EDITAR.png")}
            posicion={"center"}
            onpress={editCar}
            isEdit={true}
          />
        </View>

        {!tuto && (isEmpty(data) || addCar) && (
          <Cuestionario
            visible={visible}
            setVisible={setVisible}
            setVehiculo={setVehiculo}
            vehiculo={vehiculo}
            profile={profile}
            setProfile={setProfile}
            addCar={addCar}
            setAddCar={setAddCar}
            setData={addCar ? setData : null}
            index={index}
            isUpdate={isUpdate}
            isEditIndex={isEditIndex}
            toastRef={toastRef}
          />
        )}
        <ShowUpdate />
        <Loading isVisible={loading} text="Cargando datos..." />
        {!blockAds && <Banner />}
      </ImageBackground>
    </View>
  );
}

function ShowUpdate() {
  const [showModal, setShowModal] = useState(true);
  return (
    <Modal isVisible={showModal} setIsVisible={setShowModal} close={true}>
      <ImageBackground source={background} imageStyle={{ borderRadius: 30 }}>
        <View>
          <NewVersion setShowModal={setShowModal} />
        </View>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  vertical: {
    flexDirection: "column",
  },
  viewperfil: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  nombre: {
    fontWeight: "900",
    fontSize: 30,
    color: colorTexto,
  },
  perfilhzt: {
    flexDirection: "row",
  },
  subtitle: {
    color: colorTexto,
    fontWeight: "900",
    fontSize: 18,
  },
  circle: {
    borderRadius: 30,
    height: 85,
    width: 85,
  },
  linea: {
    width: 250,
    height: 3,
    borderRadius: 10,
    backgroundColor: colorTexto,
  },
});
