import { StyleSheet, Text, ScrollView } from 'react-native';
import React from 'react';
import InputInfo from '../../components/InputInfo';
import {
  patente,
  modelo,
  anio,
  chasis,
} from '../../utils/Descripcion/descGeneral';

export default function General() {
  return (
    <ScrollView>
      <InputInfo
        descripcion={patente}
        placeholder={'AB-CD-00'}
        label={'Placa Patente'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={''}
        placeholder={'KIA'}
        label={'Marca'}
        iconinfo={false}
      />
      <InputInfo
        descripcion={modelo}
        placeholder={'Cerato'}
        label={'Modelo'}
        iconinfo={true}
      />
      <InputInfo
        descripcion={anio}
        placeholder={'2010'}
        label={'Año'}
        iconinfo={true}
        keyboard={'numeric'}
      />
      <InputInfo
        descripcion={chasis}
        placeholder={'8A1CJHGC0NF000001'}
        label={'Chasis'}
        iconinfo={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
