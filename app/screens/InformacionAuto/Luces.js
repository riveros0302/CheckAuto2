import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputInfo from '../../components/InputInfo';
import { tipo, potencia } from '../../utils/Descripcion/descLuces';

export default function Luces() {
  return (
    <View>
      <Text style={styles.txt}>Luces bajas</Text>
      <InputInfo
        descripcion={tipo}
        placeholder={'H7'}
        label={'Tipo de bombilla'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={potencia}
        placeholder={'55W'}
        label={'Potencia'}
        iconinfo={true}
      />
      <Text style={styles.txt}>Luces altas</Text>
      <InputInfo
        descripcion={tipo}
        placeholder={'H1'}
        label={'Tipo de bombilla'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={potencia}
        placeholder={'55W'}
        label={'Potencia'}
        iconinfo={true}
      />
      <Text style={styles.txt}>Luces de niebla</Text>
      <InputInfo
        descripcion={tipo}
        placeholder={'H11'}
        label={'Tipo de bombilla'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={potencia}
        placeholder={'55W'}
        label={'Potencia'}
        iconinfo={true}
      />
      <Text style={styles.txt}>Luces intermitentes</Text>
      <InputInfo
        descripcion={tipo}
        placeholder={'7440'}
        label={'Tipo de bombilla'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={potencia}
        placeholder={'21W'}
        label={'Potencia'}
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
