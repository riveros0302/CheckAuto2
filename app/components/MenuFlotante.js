import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import BotonFlotante from './BotonFlotante';
import { useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';
import Modal from './Modal';
import { Button, Icon } from 'react-native-elements';
import { generatePDF } from '../utils/PdfAuto';
import { downloadImage } from '../utils/uploadPhoto';
import Loading from './Loading';

export default function MenuFlotante(props) {
  const {
    datos,
    main,
    data,
    isPDF,
    index,
    titulo,
    pdfurl,
    imageUri,
    setReload,
    setTxtLoad,
    isSetting,
    toastRef,
    isShowPDF,
    isNotification,
    isLogin,
    interstitial,
    blockAds,
  } = props;
  const navigation = useNavigation();
  const [imagen, setImagen] = useState(require('../../assets/Iconos/HOME.png'));
  const [array, setArray] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const keysToFilter = [
    'url_foto',
    'createBy',
    'Index',
    'device',
    'documentos',
  ];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (main) {
      setImagen(require('../../assets/Iconos/MENU0.png'));

      const dataArray = Object.entries(data)
        .filter(([key]) => !keysToFilter.includes(key))
        .map(([key, value]) => ({ [key]: value }));
      setArray(dataArray);
    } else {
      setArray(datos);
    }
  }, [datos, data, main]);

  //COMPARTIR EL ARCHIVO PDF UNA VEZ DESCARGADO
  const shareFile = async () => {
    downloadImage(
      pdfurl ? pdfurl : null,
      imageUri ? imageUri : null,
      titulo,
      index,
      setReload,
      setTxtLoad
    ).then(async (res) => {
      setReload(false);
      try {
        const shareOptions = {
          url: `file://${res}`,
          type: pdfurl ? 'application/pdf' : 'image/jpeg',
        };

        await Share.open(shareOptions);
      } catch (error) {
        console.log('Error al compartir:', error.message);
      }
    });
  };

  const ifMain = () => {
    if (main) {
      navigation.navigate('todos', { toastRef });
    } else {
      if (isShowPDF) {
        navigation.navigate('home');
      } else {
        navigation.goBack();
      }
    }
  };

  const ifpdf = () => {
    if (!isShowPDF) {
      // si no es showPDF entonces mostrar anuncio
      if (!blockAds) {
        interstitial.show();
      }
    }

    if (isPDF) {
      imageUri
        ? shareFile()
        : toastRef.current.show('¡Debes subir un documento!', 2000);
    } else {
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.view}>
      <BotonFlotante source={imagen} posicion={'flex-start'} onpress={ifMain} />
      {!isSetting && !isNotification && !isLogin && (
        <BotonFlotante
          source={require('../../assets/Iconos/COMPARTIR.png')}
          posicion={'flex-end'}
          onpress={ifpdf}
        />
      )}
      <OptionShare
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        array={array}
        data={data}
        setLoading={setLoading}
      />

      <Loading isVisible={loading} text='Generando PDF' />
    </View>
  );
}

function OptionShare(props) {
  const { isVisible, setIsVisible, array, data, setLoading } = props;

  const shareAuto = async () => {
    try {
      let keysMessage = 'Datos de mi vehiculo:\n\n';

      array.forEach((auto) => {
        const key = Object.keys(auto)[0];
        const value = auto[key];
        keysMessage += key + ': ' + value + '\n';
      });

      const shareOptions = {
        message: keysMessage,
      };
      setIsVisible(false);
      const result = await Share.open(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con alguna aplicación específica (result.activityType)
          console.log('compartida con alguna aplicacion');
        } else {
          // Compartido
          console.log('compartido');
        }
      } else if (result.action === Share.dismissedAction) {
        // Compartir cancelado
        console.log('compartir cnacelado');
      }
    } catch (error) {
      console.log('Error al compartirrr:', error.message);
    }
  };

  const crearPdf = async () => {
    try {
      setLoading(true);
      setIsVisible(false);
      const uri = await generatePDF(data);
      console.log('url del pdf: ' + uri);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      colorModal={'white'}
      close={true}
    >
      <Text style={styles.titulo}>
        ¿Como quieres compartir la información de tu vehiculo?
      </Text>
      <Button
        title={'Datos basicos'}
        buttonStyle={styles.btn}
        titleStyle={styles.txt}
        icon={<Icon type='material-community' name='format-list-numbered' />}
        onPress={shareAuto}
      />
      <Button
        title={'Datos completos'}
        buttonStyle={styles.btn}
        titleStyle={styles.txt}
        icon={<Icon type='material-community' name='file-pdf-box' />}
        onPress={crearPdf}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  btn: {
    backgroundColor: 'white',
  },
  txt: {
    color: 'grey',
  },
  titulo: {
    alignSelf: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    width: '90%',
    fontSize: 15,
    marginBottom: 15,
  },
});
