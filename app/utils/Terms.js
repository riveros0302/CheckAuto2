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

export default function Terms(props) {
  const { logged } = props;
  const [url, setUrl] = useState({
    uri: 'https://firebasestorage.googleapis.com/v0/b/checkauto-3f0c2.appspot.com/o/Politicas%2FTerminos%20y%20condiciones%20de%20uso.pdf?alt=media&token=d31d5fb5-e079-4f39-bb13-47821c26d0d7&_gl=1*b6dd8j*_ga*MTk3ODg5Mjc0Ni4xNjc0NTA1MTkz*_ga_CW55HF8NVT*MTY5Nzc2ODAwMy45OC4xLjE2OTc3NjkyMjIuNDYuMC4w',
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
        {!logged && <Titulo title='Condiciones de uso' />}
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
