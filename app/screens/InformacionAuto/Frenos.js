import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputInfo from '../../components/InputInfo';
import { tipo, pastillas } from '../../utils/Descripcion/descFrenos';

export default function Frenos() {
  return (
    <View>
      <InputInfo
        descripcion={pastillas}
        placeholder={'Disco'}
        label={'Pastillas de freno'}
        iconinfo={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    alignSelf: 'center',
    color: '#b1b1b1',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
