import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import InputInfo from '../../components/InputInfo';
import {
  combustible,
  cilindrada,
  potencia,
  torque,
  compresion,
  consumo,
  transmision,
  aceite,
} from '../../utils/Descripcion/descMotor';

export default function Motor() {
  return (
    <ScrollView>
      <InputInfo
        descripcion={combustible}
        placeholder={'95'}
        label={'Gasolina'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={cilindrada}
        placeholder={'1.6 litros o 1600 cc'}
        label={'Cilindrada'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={potencia}
        placeholder={'110 HP o 81 kW'}
        label={'Potencia'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={torque}
        placeholder={'150 Nm o 110 lb-ft'}
        label={'Torque'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={compresion}
        placeholder={'10:1'}
        label={'Relación de compresión'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={consumo}
        placeholder={'8,5 L/100km'}
        label={'Consumo de combustible'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={transmision}
        placeholder={'Manual/Automatica'}
        label={'Sistema de transmisión'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={aceite}
        placeholder={'SAE 5W-30'}
        label={'Tipo de aceite'}
        iconinfo={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
