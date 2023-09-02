import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Image } from 'react-native-elements';

export default function BotonFlotante(props) {
  const { source, posicion, onpress, isEdit } = props;
  const size = 30;
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        alignSelf: posicion,
        bottom: posicion == 'center' || isEdit ? -90 : null,
        right: isEdit ? 70 : null,
        marginTop: 10,
        zIndex: 1,
      }}
      onPress={onpress}
    >
      {isEdit ? (
        <Image
          source={source}
          style={{
            width: 40,
            height: 43,
            margin: 15,
          }}
        />
      ) : (
        <Image
          source={source}
          style={{
            width:
              posicion == 'flex-end' ? 25 : posicion == 'center' ? 70 : size,
            height:
              posicion == 'flex-end' ? 25 : posicion == 'center' ? 70 : size,
            margin: 15,
          }}
        />
      )}
    </TouchableOpacity>
  );
}
