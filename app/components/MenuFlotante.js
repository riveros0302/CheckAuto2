import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import BotonFlotante from './BotonFlotante';
import { useNavigation } from '@react-navigation/native';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

export default function MenuFlotante(props) {
  const {
    datos,
    main,
    data,
    isPDF,
    index,
    titulo,
    pdfurl,
    setReload,
    setTxtLoad,
    isSetting,
  } = props;
  const navigation = useNavigation();
  const [imagen, setImagen] = useState(require('../../assets/Iconos/HOME.png'));
  const [array, setArray] = useState([]);
  const keysToFilter = [
    'url_foto',
    'createBy',
    'Index',
    'device',
    'documentos',
  ];

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

  //DESCARGAR EL ARCHIVO PDF DESDE FIREBASE
  const downloadPdfFromFirebase = async () => {
    setReload(true);
    setTxtLoad('Generando PDF...');
    const { config, fs } = RNFetchBlob;
    const downloads = fs.dirs?.DownloadDir;
    const localFilePath = downloads + '/' + titulo + index + '.pdf';

    // Verificar si el archivo ya existe en la ubicación local
    const fileExists = await fs.exists(localFilePath);

    // Si el archivo existe, eliminarlo antes de descargar el nuevo
    if (fileExists) {
      try {
        await fs.unlink(localFilePath);
        console.log('Archivo existente eliminado:', localFilePath);
      } catch (error) {
        console.error('Error al eliminar el archivo existente:', error);
      }
    }

    return new Promise((resolve, reject) => {
      config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: localFilePath,
        },
      })
        .fetch('GET', pdfurl.uri)
        .then((res) => {
          console.log('Archivo PDF descargado correctamente:', res.path());
          resolve(res.path()); // Resolvemos la promesa con la ruta del archivo descargado
        })
        .catch((e) => {
          console.error('Error al descargar el archivo:', e);
          reject(e); // Rechazamos la promesa con el error en caso de falla
        });
    });
  };

  //COMPARTIR EL ARCHIVO PDF UNA VEZ DESCARGADO
  const sharePDF = async () => {
    downloadPdfFromFirebase().then(async (res) => {
      setReload(false);
      // console.log('recibiendo url local del pdf: ' + res);
      try {
        const shareOptions = {
          // message: 'compartir pdff',
          url: `file://${res}`,
          type: 'application/pdf',
        };

        await Share.open(shareOptions);
      } catch (error) {
        console.log('Error al compartir:', error.message);
      }
    });
  };

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
      const result = await Share.open(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con alguna aplicación específica (result.activityType)
        } else {
          // Compartido
        }
      } else if (result.action === Share.dismissedAction) {
        // Compartir cancelado
      }
    } catch (error) {
      console.log('Error al compartirrr:', error.message);
    }
  };

  const ifMain = () => {
    if (main) {
      navigation.navigate('todos');
    } else {
      navigation.goBack();
    }
  };

  const ifpdf = () => {
    if (isPDF) {
      sharePDF();
    } else {
      shareAuto();
    }
  };

  return (
    <View style={styles.view}>
      <BotonFlotante source={imagen} posicion={'flex-start'} onpress={ifMain} />
      {!isSetting && (
        <BotonFlotante
          source={require('../../assets/Iconos/COMPARTIR.png')}
          posicion={'flex-end'}
          onpress={ifpdf}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
});
