import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { botoncolor, colorTexto } from '../utils/tema';

export default function BotonAnimado({
  setIndexIntro,
  indexIntro,
  setIsOmitir,
  omitir,
  setTuto,
}) {
  const [title, setTitle] = useState('OK');
  const handlePress = () => {
    // Handle button press

    if (omitir) {
      setTuto(false);
    } else if (indexIntro === 3) {
      setTuto(false);
      const url = 'https://www.patentechile.com/';
      Linking.openURL(url);
    } else {
      setIndexIntro(indexIntro + 1);
    }
  };

  useEffect(() => {
    switch (indexIntro) {
      case 1:
        setTitle('Comencemos');
        break;
      case 2:
        setTitle(omitir ? 'Omitir' : 'Enseñame');
        setIsOmitir(true);
        break;
      case 3:
        setTitle('Consultar');
        setIsOmitir(false);
        break;

      default:
        break;
    }
  }, [indexIntro]);

  return (
    <Animatable.View
      animation='bounceIn'
      duration={900}
      style={{ marginTop: '25%' }}
    >
      <TouchableOpacity onPress={handlePress}>
        <View
          style={{
            backgroundColor: omitir ? 'grey' : botoncolor,
            padding: 20,
            borderRadius: 50,
            alignSelf: 'center',
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.21,
            shadowRadius: 8.19,
            elevation: 11,
          }}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: colorTexto,
    fontSize: 23,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
