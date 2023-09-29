import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
  Keyboard,
  Platform,
} from 'react-native';
import { Button, Icon, Image } from 'react-native-elements';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Modal from './Modal';
import { isEmpty } from 'lodash';
import InputInfo from './InputInfo';
import { patente, descripciones } from '../utils/Descripcion/descGeneral';
import { updateAuto, getInfoAutoIndex } from '../utils/Database/auto';
import ShowPDF from './ShowPDF';
import analytics from '@react-native-firebase/analytics';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Boton(props) {
  const {
    icono,
    item,
    titulo,
    value,
    data,
    onPress,
    fontSize,
    index,
    updateData,
    isDocument,
    isCheck,
    isPrincipal,
    isNotification,
  } = props;
  const navigation = useNavigation();
  const [isVisible, setIsVisible] = useState(false);

  const selected = async () => {
    switch (item) {
      case 'id':
        navigation.navigate('Mis Documentos', { index, data });
        break;
      case 'auto':
        await analytics().logEvent('btn_General', {
          id: 'id_de_prueba',
          item: 'Presiono boton de General',
        });
        navigation.navigate('Mi Auto', { data, index });
        break;
      case 'alarma':
        console.log('index recibido en Boton.js: ' + index);
        navigation.navigate('Mi Alarma', { index });
        break;
      case 'ajustes':
        navigation.navigate('Mis Ajustes');
        break;
      case 'pdf':
        navigation.navigate('add-document', { index, titulo });
        break;

      default:
        break;
    }
  };

  const handleLongPress = () => {
    // Hacer una pequeña vibración durante 50 ms
    Vibration.vibrate(50);
    setIsVisible(true);
  };

  // Función para formatear el título
  function formatTitle(title) {
    // Reemplazar los '_' por espacios y convertir a mayúsculas
    return title.replace(/_/g, ' ').toUpperCase();
  }

  return (
    <View style={styles.cont}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.7}
        onPress={isEmpty(item) ? onPress : selected}
        onLongPress={
          isPrincipal
            ? null
            : isDocument
            ? null
            : isNotification
            ? null
            : handleLongPress
        }
        disabled={
          isPrincipal || isDocument || isNotification
            ? false
            : Platform.OS == 'android'
            ? true
            : false
        }
      >
        <Image source={icono} style={styles.icono} />
        {isCheck ? (
          <Icon
            type='material-community'
            name='check-circle-outline'
            iconStyle={styles.tick}
            containerStyle={styles.containerTick}
            size={40}
          />
        ) : null}
        <Text style={styles.txtTitle}>{formatTitle(titulo)}</Text>
        <Text
          style={{
            color: 'white',
            fontWeight: '900',
            alignSelf: 'center',
            fontSize: fontSize ? fontSize : 20,
          }}
        >
          {value}
        </Text>
      </TouchableOpacity>
      {isDocument ? (
        <ShowPdf
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          value={value}
          titulo={titulo}
          index={index}
          updateData={updateData}
        />
      ) : (
        <ShowModal
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          value={value}
          titulo={titulo}
          index={index}
          updateData={updateData}
        />
      )}
    </View>
  );
}

function ShowModal(props) {
  const { isVisible, setIsVisible, value, titulo, index, updateData } = props;
  const [valuetxt, setValuetxt] = useState(value);
  const [reload, setReload] = useState(false);
  const keysToFilter = [
    'url_foto',
    'createBy',
    'Index',
    'documentos',
    'device',
  ];

  useEffect(() => {
    setValuetxt(value);
  }, [value]);

  const saveDato = () => {
    setReload(true);
    updateAuto(titulo, valuetxt, index)
      .then((res) => {
        // toastRef.current.show(res);

        getInfoAutoIndex(index).then((data) => {
          const result = Object.entries(data)
            .filter(([key]) => !keysToFilter.includes(key))
            .map(([key, value]) => ({ [key]: value }));
          updateData(result);
          setReload(false);
          setIsVisible(false);
        });
      })
      .catch((err) => {
        setReload(false);
      });
  };

  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      colorModal={'white'}
      close={true}
    >
      <View>
        <InputInfo
          descripcion={descripciones[titulo]}
          label={titulo}
          iconinfo={titulo == 'Marca' ? false : true}
          valuetxt={valuetxt}
          setValuetxt={setValuetxt}
          keyboard={titulo == 'Año' && 'numeric'}
        />
        <Button
          buttonStyle={styles.btnModal}
          onPress={saveDato}
          icon={
            reload ? (
              <ActivityIndicator size='small' color='white' />
            ) : (
              <Icon name='check' type='material-community' size={30} />
            )
          }
        />
      </View>
    </Modal>
  );
}

function ShowPdf(props) {
  const { isVisible, setIsVisible, value, titulo, index, updateData } = props;
  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      colorModal={'white'}
      close={true}
    >
      <ShowPDF index={index} nameDoc={titulo} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  cont: {
    padding: 10,
    width: screenWidth / 2,
    height: screenWidth / 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
  icono: {
    width: screenWidth / 3.3,
    height: screenHeight / 6.5,
  },
  txtTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewBtnModal: {
    flexDirection: 'row',
    borderWidth: 1,
    alignSelf: 'flex-end',
  },
  btnModal: {
    borderRadius: 50,
    marginRight: 5,
    backgroundColor: '#00a680',
    width: 100,
    alignSelf: 'flex-end',
  },
  containerTick: {
    position: 'absolute',
    right: 25,
    bottom: 45,
  },
  tick: {
    color: 'white',
    backgroundColor: 'green',
    borderRadius: 20,
  },
});
