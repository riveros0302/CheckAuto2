import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Icon, Image } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { background, secondary } from '../../utils/tema';
import Titulo from '../../components/Titulo';
import {
  getAllDataCarByUserId,
  deleteCar,
  getFirstDataCarByUserId,
} from '../../utils/Database/auto';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import Purchases from 'react-native-purchases';
import auth from '@react-native-firebase/auth';
import { useRevenueCat } from '../../utils/RevenueCat/RevenueCatProvider';
import Loading from '../../components/Loading';

export default function Todos(props) {
  const { route } = props;
  const { toastRef } = route.params;
  const [autos, setAutos] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const { idSubs } = useRevenueCat();

  useEffect(() => {
    if (isFocused) {
      const getCar = async () => {
        setLoading(true);
        const { customerInfo } = await Purchases.logIn(auth().currentUser.uid);
        if (customerInfo.entitlements.active['pro']) {
          switch (idSubs) {
            case 'pp_android:pp1m' || 'pp_android:pp1a':
              getAutos(3);
              break;
            case 'po_android:po1m' || 'po_android:po1a':
              getAutos(6);
              break;
            case 'ppt_android:ppt1m' || 'ppt_android:ppt1a':
              getAutos(12);
              break;

            default:
              break;
          }
        } else {
          getFirstDataCarByUserId().then((res) => {
            setAutos(res);
            setLoading(false);
          });
        }
      };
      getCar();
    }
  }, []);

  const getAutos = async (num) => {
    await getAllDataCarByUserId(num).then((res) => {
      const existingIds = autos.map((auto) => auto.id);
      const newAutos = res.filter((auto) => !existingIds.includes(auto.id));
      setAutos((prevAutos) => [...prevAutos, ...newAutos]);
      setLoading(false);
    });
  };

  return (
    <View>
      <ImageBackground source={background} style={{ height: '100%' }}>
        <Titulo title={'MIS VEHICULOS'} />
        {loading ? (
          <ActivityIndicator size='large' color='blue' />
        ) : (
          <View>
            <FlatList
              data={autos}
              renderItem={(item) => (
                <BotonAuto
                  item={item}
                  navigation={navigation}
                  setAutos={setAutos}
                  setLoading={setLoading}
                />
              )}
              keyExtractor={(item) => item.Index.toString()}
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

function BotonAuto(props) {
  const { item, navigation, setAutos, setLoading } = props;

  // Función para actualizar los vehículos en el estado local
  const updateAutos = (newAutos) => {
    setAutos(newAutos);
  };

  const goCar = () => {
    navigation.navigate('home', { id: item.item.Index });
  };

  const handleDelete = () => {
    deleteCar(item.item.Index)
      .then((res) => {
        updateAutos((prevAutos) =>
          prevAutos.filter((auto) => auto.Index !== item.item.Index)
        );
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const confirmDelete = () => {
    Alert.alert(
      'Eliminar vehículo',
      '¿Estás seguro de que deseas eliminar este vehículo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 40,
          height: 60,
          width: 60,
          marginTop: 50,
          marginRight: 10,
        }}
        onPress={confirmDelete}
      >
        <Icon
          type='material-community'
          name='delete'
          color={'white'}
          size={30}
        />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.view} key={item.index}>
        <TouchableOpacity style={styles.boton} onPress={goCar}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={require('../../../assets/Iconos/EDITAR_FOTO.png')}
              style={styles.img}
            />
            <View style={styles.txtview}>
              <Text style={styles.txt}>{item.item.Marca}</Text>
              <View style={styles.linea} />
              <Text style={styles.txt2}>{item.item.Modelo}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  view: {
    width: '90%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  boton: {
    backgroundColor: 'white',
    borderRadius: 80,
    height: 110,
    marginTop: 30,
    justifyContent: 'center',
  },
  img: {
    width: 70,
    height: 70,
    marginLeft: 25,
  },
  txtview: {
    justifyContent: 'center',
    marginLeft: -5,
  },
  txt: {
    color: secondary,
    fontWeight: '900',
    fontSize: 25,
    marginLeft: 20,
  },
  txt2: {
    color: secondary,
    fontWeight: '900',
    fontSize: 18,
    marginLeft: 20,
  },
  linea: {
    width: 190,
    height: 3,
    borderRadius: 10,
    backgroundColor: secondary,
    alignSelf: 'center',
  },
});
