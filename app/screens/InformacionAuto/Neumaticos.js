import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputInfo from '../../components/InputInfo';
import {
  tamanio,
  indiceCarga,
  fabricacion,
  presion,
} from '../../utils/Descripcion/descNeumaticos';

export default function Neumaticos() {
  return (
    <View>
      <InputInfo
        descripcion={tamanio}
        placeholder={'225/50 R17 94V'}
        label={'Tamaño'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={indiceCarga}
        placeholder={'215/60R16 95H'}
        label={'Indice de carga y velocidad'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={fabricacion}
        placeholder={'3419'}
        label={'Fecha de fabricación'}
        iconinfo={true}
        keyboard={'numeric'}
      />
      <InputInfo
        descripcion={presion}
        placeholder={'32'}
        label={'Aire'}
        iconinfo={true}
        keyboard={'numeric'}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
