import { StyleSheet, Text, View, ImageBackground, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import Cuestionario from './Cuestionario';
import AvatarCar from '../../components/AvatarCar';
import { isEmpty } from 'lodash';
import {
  checkIfUserExists,
  getDataCarByUserIdAndIndex,
  getAllDataCarByUserId,
  getLowestIndex,
} from '../../utils/Database/auto';
import Boton from '../../components/Boton';
import BotonFlotante from '../../components/BotonFlotante';
import { background, colorTexto } from '../../utils/tema';
import Loading from '../../components/Loading';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import MenuFlotante from '../../components/MenuFlotante';
import { useRevenueCat } from '../../utils/RevenueCat/RevenueCatProvider';
import Purchases from 'react-native-purchases';
import auth from '@react-native-firebase/auth';

export default function Principal({ user, setUser, route }) {
  const [visible, setVisible] = useState(true);
  const [data, setData] = useState({});
  const [vehiculo, setVehiculo] = useState({});
  // const [user, setUser] = useState(isEmpty(user) ? null : user);
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const index = !isEmpty(route.params) ? route.params.id : 0;

  const isFocused = useIsFocused(); //usado para refrescar la ventana cada vez que se muestra
  const [addCar, setAddCar] = useState(false);
  const { idSubs } = useRevenueCat();
  const [NumAutos, setNumAutos] = useState(0);

  useEffect(() => {
    setLoading(true);

    getAllDataCarByUserId().then((res) => {
      setNumAutos(res.length);
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      // crearAuto;

      const fetchUserId = async () => {
        try {
          await checkIfUserExists().then((empty) => {
            if (!empty) {
              console.log('El usuario existe en la tabla "auto"');
              getDataCarByUserIdAndIndex(index).then((res) => {
                setData(res);
                setProfile(res.url_foto);
                setLoading(false);
              });
            } else {
              console.log('El usuario no existe en la tabla "auto" con id: ');
              setData({});
              setLoading(false);
            }
          });
        } catch (error) {
          console.log('Error al realizar la consulta:', error);
          setLoading(false);
        }
      };

      fetchUserId();
    }
  }, [index, isFocused, visible]);

  const pressAdd = async () => {
    //hacemos que cada vez que presione este boton consulte primero se la suscripcion esta activa
    const { customerInfo } = await Purchases.logIn(auth().currentUser.uid);

    if (customerInfo.entitlements.active['pro']) {
      setVisible(true);
      setAddCar(true);
      switch (idSubs) {
        case 'pp_android:pp1m' || 'pp_android:pp1a':
          if (NumAutos >= 3) {
            console.log('ya tienes 3 vehiculos NumAutos: ' + NumAutos);
            setVisible(false);
            setAddCar(false);
          }
          break;
        case 'po_android:po1m' || 'po_android:po1a':
          if (NumAutos >= 6) {
            console.log('ya tienes 6 vehiculos: ' + NumAutos);
            setVisible(false);
            setAddCar(false);
          }
          break;
        case 'ppt_android:ppt1m' || 'ppt_android:ppt1a':
          if (NumAutos >= 12) {
            console.log('ya tienes 12 vehiculos: ' + NumAutos);
            setVisible(false);
            setAddCar(false);
          }
          break;

        default:
          break;
      }
    } else {
      navigation.navigate('suscripcion');
    }

    //navigation.navigate('borrar');
  };

  return (
    <View style={styles.vertical}>
      <ImageBackground source={background} style={{ height: '100%' }}>
        <MenuFlotante main={true} data={data} isPDF={false} />

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
              icono={require('../../../assets/Iconos/MENU1.png')}
              item='auto'
              titulo='GENERAL'
              data={data}
              index={index}
              isPrincipal={true}
            />
            <Boton
              icono={require('../../../assets/Iconos/DOCUMENTOS.png')}
              item='id'
              titulo='DOCUMENTOS'
              index={index}
              isPrincipal={true}
            />
          </View>
          <View style={styles.container}>
            <Boton
              icono={require('../../../assets/Iconos/ALARMAS.png')}
              item='alarma'
              titulo='NOTIFICACIONES'
              isPrincipal={true}
            />
            <Boton
              icono={require('../../../assets/Iconos/AJUSTES.png')}
              item='ajustes'
              titulo='AJUSTES'
              isPrincipal={true}
            />
          </View>
          <BotonFlotante
            source={require('../../../assets/Iconos/AGREGAR.png')}
            posicion={'center'}
            onpress={pressAdd}
          />
        </View>

        {isEmpty(data) || addCar ? (
          <View>
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
            />
          </View>
        ) : null}
        <Loading isVisible={loading} text='Cargando datos...' />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  vertical: {
    flexDirection: 'column',
  },
  viewperfil: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  nombre: {
    fontWeight: '900',
    fontSize: 30,
    color: colorTexto,
  },
  perfilhzt: {
    flexDirection: 'row',
  },
  subtitle: {
    color: colorTexto,
    fontWeight: '900',
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
