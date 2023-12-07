import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  PermissionsAndroid,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button } from "react-native-elements";
import * as Notifications from "expo-notifications";
import { background } from "../../utils/tema";
import MenuFlotante from "../../components/MenuFlotante";
import Titulo from "../../components/Titulo";
import Boton from "../../components/Boton";
import Calendario from "./Calendario";
import { getDatesFromUser } from "../../utils/Database/users";
import Banner2 from "../../components/Ads/Banner2";
import { getHoursFromFirestore } from "../../utils/Database/setting";
import TestNotification from "./TestNotification";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

export default function Alarma({ route }) {
  const { index, blockAds } = route.params;
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [indexNot, setIndexNot] = useState();
  const [time1, setTime1] = useState(null);

  const showCalendar = (id) => {
    setDatePickerVisible(true);
    setIndexNot(id);
  };

  const localnotification1 = async () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const { horaPC, minutePC } = await getHoursFromFirestore();
    console.log("QUE RECIBE HORAPC: " + horaPC + " min: " + minutePC);
    // Convierte la cadena date1 en un objeto de fecha
    const date1Obj = new Date(date1);
    date1Obj.setHours(horaPC, minutePC, 0); // Establecer la hora a las 9:00 AM
    const triggerTime = date1Obj.getTime(); // Obtén el tiempo seleccionado en milisegundos

    // Calcula el tiempo en segundos hasta la hora seleccionada
    const secondsDiff = Math.floor((triggerTime - now) / 1000);

    if (secondsDiff > 0) {
      const notificationContent = {
        title: "Permiso de Circulación",
        body: "Hola, recuerda sacar el permiso de circulación este mes.",
        data: { anyData: "additional data" }, // Datos adicionales que desees incluir
      };

      // Programa la notificación con el tiempo en segundos
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: { seconds: secondsDiff },
      });
    }
  };

  const localnotification2 = async () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const { horaRT, minuteRT } = await getHoursFromFirestore();
    console.log("QUE RECIBE HORART: " + horaRT + " min: " + minuteRT);
    // Convierte la cadena date1 en un objeto de fecha
    const date2Obj = new Date(date2);
    date2Obj.setHours(horaRT, minuteRT, 0); // Establecer la hora a las 9:00 AM
    const triggerTime = date2Obj.getTime(); // Obtén el tiempo seleccionado en milisegundos

    // Calcula el tiempo en segundos hasta la hora seleccionada
    const secondsDiff = Math.floor((triggerTime - now) / 1000);

    if (secondsDiff > 0) {
      const notificationContent = {
        title: "Revisión Técnica",
        body: "Hola, recuerda ir a la Revisión Técnica este mes",
        data: { anyData: "additional data" }, // Datos adicionales que desees incluir
      };

      // Programa la notificación con el tiempo en segundos
      await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: { seconds: secondsDiff },
      });
    }
  };

  useEffect(() => {
    const getDatesFirebase = async () => {
      try {
        const { date1, date2 } = await getDatesFromUser(index);
        setDate1(date1);
        setDate2(date2);
        localnotification1();
        localnotification2();
      } catch (error) {}
    };
    getDatesFirebase();
  }, []);

  const calendar = async (id) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Permiso de Ubicación",
          message:
            "Necesitamos acceder a tu ubicación para algunas funcionalidades.",
          buttonPositive: "Aceptar",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permiso de ubicación otorgado");
        showCalendar(id);
        // Aquí puedes realizar las operaciones que requieran acceso a la ubicación
      } else {
        console.log("Permiso de ubicación denegado");
        // Puedes manejar el caso donde el usuario no otorga permisos
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View>
      <ImageBackground source={background} style={styles.back}>
        <Titulo title="NOTIFICACIONES" />
        <View>
          <View style={styles.container}>
            <Boton
              icono={require("../../../assets/Iconos/CIRCULACION.png")}
              titulo="PERMISO CIRUCLACIÓN"
              onPress={() => calendar(1)}
              fontSize={15}
              value={date1 instanceof Date ? "" : date1}
              isNotification={true}
            />
            <Boton
              icono={require("../../../assets/Iconos/REVISION_TEC.png")}
              titulo="REVISIÓN TÉCNICA"
              onPress={() => calendar(2)}
              fontSize={15}
              value={date2 instanceof Date ? "" : date2}
              isNotification={true}
            />
          </View>
        </View>

        <View style={styles.container}></View>
        <Calendario
          isDatePickerVisible={isDatePickerVisible}
          setDatePickerVisible={setDatePickerVisible}
          setDate1={setDate1}
          date1={date1}
          setDate2={setDate2}
          date2={date2}
          index={indexNot}
          indexCar={index}
          localnotification1={localnotification1}
          localnotification2={localnotification2}
          setTime1={setTime1}
          time1={time1}
        />

        <MenuFlotante isNotification={true} />
        {!blockAds && <Banner2 />}
      </ImageBackground>
    </View>
  );

  // return <TestNotification />;
}

const styles = StyleSheet.create({
  back: {
    height: "100%",
  },
  container: {
    flexDirection: "row",
  },
});
