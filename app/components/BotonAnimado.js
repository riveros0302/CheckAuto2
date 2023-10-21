import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { botoncolor, colorTexto } from '../utils/tema';
import analytics from '@react-native-firebase/analytics';

export default function BotonAnimado({
  setIndexIntro,
  indexIntro,
  setIsOmitir,
  omitir,
  setTuto,
  restartAnimation,
}) {
  const [title, setTitle] = useState('OK');
  const animatableTextRef = useRef(null);

  const restAnim = () => {
    // Restart the 'bounceIn' animation
    animatableTextRef.current.bounceIn();
  };

  const handlePress = async () => {
    // Handle button press

    if (omitir) {
      setTuto(false);
      // Registra un evento de compra exitosa
      await analytics().logEvent('press_Omitir', {
        item_id: 'omitir presionado',
      });
    } else if (indexIntro === 3) {
      setTuto(false);
      const url = 'https://www.patentechile.com/';
      Linking.openURL(url);
      await analytics().logEvent('press_Url_patentechile', {
        item_id: 'url presionado',
      });
    } else {
      setIndexIntro(indexIntro + 1);
      restartAnimation();
      restAnim();
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
      ref={animatableTextRef}
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
