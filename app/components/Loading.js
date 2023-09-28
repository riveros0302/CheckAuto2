import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Overlay } from 'react-native-elements';
import { primary, secondary } from '../utils/tema';
import RotatingWheel from './RotatingWheel';

export default function Loading(props) {
  const { isVisible, text } = props;

  return (
    <Overlay isVisible={isVisible} overlayStyle={styles.overlay}>
      <View style={styles.view}>
        <ImageBackground
          source={require('../../assets/FONDO.png')}
          style={styles.imageBackground}
          imageStyle={{ borderRadius: 20 }}
        >
          <RotatingWheel />
          {text && <Text style={styles.text}>{text}</Text>}
        </ImageBackground>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 200,
    width: 300,
    backgroundColor: 'transparent', // Establece el fondo del overlay como transparente
    shadowColor: 'rgba(0, 0, 0, 0.0)',
    borderRadius: 10,
  },
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    flex: 1, // Hace que la imagen ocupe todo el espacio disponible
    width: '100%', // Establece el ancho al 100%
    resizeMode: 'cover', // Ajusta la imagen para cubrir todo el espacio
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 10,
  },
});
