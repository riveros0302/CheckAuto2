import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native-elements';
import React, { useState } from 'react';
import { background } from '../../utils/tema';
import { introduccion } from '../../utils/Descripcion/intro';
import TypingText from '../../components/TypingText';

export default function Inicio({ setTuto }) {
  const [indexIntro, setIndexIntro] = useState(0);
  return (
    <View>
      <ImageBackground source={background} style={styles.back}>
        <Image
          source={require('../../../assets/LOGO.png')}
          style={styles.logo}
        />
        <TypingText
          text={introduccion[indexIntro]}
          speed={25}
          setIndexIntro={setIndexIntro}
          indexIntro={indexIntro}
          setTuto={setTuto}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    width: '100%',
    height: '100%',
  },
  logo: {
    width: '100%',
    height: 300,
    top: 50,
  },
});
