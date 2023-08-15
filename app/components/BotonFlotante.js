import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Image } from 'react-native-elements';

export default function BotonFlotante(props) {
  const { source, posicion, onpress } = props;
  const size = 30;
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        alignSelf: posicion,
        bottom: posicion == 'center' ? -90 : null,
        marginTop: 10,
        zIndex: 1,
      }}
      onPress={onpress}
    >
      <Image
        source={source}
        style={{
          width: posicion == 'flex-end' ? 25 : posicion == 'center' ? 60 : size,
          height:
            posicion == 'flex-end' ? 25 : posicion == 'center' ? 60 : size,
          margin: 15,
        }}
      />
    </TouchableOpacity>
  );
}
