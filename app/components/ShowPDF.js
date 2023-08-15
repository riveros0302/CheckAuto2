import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Button, Icon, Image } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import Pdf from 'react-native-pdf';
import * as DocumentPicker from 'expo-document-picker';
import { primary, background } from '../utils/tema';
import {
  uploadPDFToFirebase,
  getURLFromFirestore,
} from '../utils/Database/auto';
import Loading from './Loading';
import MenuFlotante from './MenuFlotante';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function ShowPDF(props) {
  const { route } = props;
  const { index, titulo } = route.params;
  const [pdfurl, setPdfurl] = useState(null);
  const [reload, setReload] = useState(false);
  const [txtLoad, setTxtLoad] = useState('Cargando documento...');
  console.log(titulo);

  useEffect(() => {
    setReload(true);
    getURLFromFirestore(index, titulo)
      .then((urlpdf) => {
        setPdfurl({
          uri: urlpdf,
          cache: true,
        });
        setReload(false);
      })
      .catch((err) => {
        setReload(false);
      });
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pdfBlobURL = result.assets[0].uri;

        setReload(true);
        // Subir el PDF a Firebase Storage y obtener la URL de descarga
        try {
          uploadPDFToFirebase(pdfBlobURL, index, titulo)
            .then((url) => {
              setPdfurl({
                uri: url,
                cache: true,
              });
              setReload(false);
            })
            .catch((err) => {
              console.log(err);
              setReload(false);
            });
        } catch (error) {
          setReload(false);
          console.log(
            'Error al subir el archivo PDF a Firebase:',
            error.message
          );
        }
      } else {
        setReload(false);
        console.log('Se canceló la selección');
      }
    } catch (error) {
      setReload(false);
      console.log('Error al seleccionar el documento:', error);
    }
  };

  return (
    <ImageBackground source={background} style={styles.image}>
      <MenuFlotante
        isPDF={true}
        index={index}
        titulo={titulo}
        pdfurl={pdfurl}
        setReload={setReload}
        setTxtLoad={setTxtLoad}
      />
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
          marginTop: 70,
          marginBottom: 30,
        }}
      >
        {pdfurl ? (
          <Pdf
            trustAllCerts={false}
            source={pdfurl}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPressLink={(uri) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={{ flex: 1, alignSelf: 'stretch' }}
          />
        ) : (
          <Image
            source={require('../../assets/Iconos/NOPDF.png')}
            style={styles.nopdf}
          />
        )}

        <Loading isVisible={reload} text={txtLoad} />
      </SafeAreaView>
      <View style={styles.floatingButton}>
        <Icon
          name='pencil'
          type='material-community'
          color='white'
          size={40}
          onPress={pickDocument}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  nopdf: {
    width: screenWidth / 1.5,
    height: screenHeight / 2.4,
    margin: 30,
  },
  iconst: {
    width: '50%',
    position: 'absolute',
  },
  image: {
    height: '100%',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 40,
    right: 15,
    backgroundColor: primary, // Color de fondo del botón flotante
    borderRadius: 50, // Hacer el botón circular
    padding: 10,
  },
});
