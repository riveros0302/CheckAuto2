import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import Pdf from 'react-native-pdf';
import MenuFlotante from '../components/MenuFlotante';
import { background } from './tema';
import Titulo from '../components/Titulo';

export default function PoliticasyUso(props) {
  const { logged } = props;
  const [url, setUrl] = useState({
    uri: 'https://firebasestorage.googleapis.com/v0/b/checkauto-3f0c2.appspot.com/o/Politicas%2FPoliticas%20de%20Privacidad.pdf?alt=media&token=b5599fd5-7f00-4248-abea-ca57208ddaff&_gl=1*cblw2t*_ga*MTk3ODg5Mjc0Ni4xNjc0NTA1MTkz*_ga_CW55HF8NVT*MTY5NTg1MzI5Ni44Ny4xLjE2OTU4NjA5NDQuNTEuMC4w',
    cache: true,
  });
  return (
    <ImageBackground source={background} style={styles.image}>
      {!logged && <MenuFlotante isLogin={true} />}

      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        {!logged && <Titulo title='Politicas de privacidad' />}
        <Pdf
          trustAllCerts={false}
          source={url}
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
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
  },
});
