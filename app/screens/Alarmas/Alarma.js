import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import { background } from '../../utils/tema';
import MenuFlotante from '../../components/MenuFlotante';
import Titulo from '../../components/Titulo';
import Boton from '../../components/Boton';
import Calendario from './Calendario';

export default function Alarma() {
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [index, setIndex] = useState();

  const showCalendar = (id) => {
    setDatePickerVisible(true);
    setIndex(id);
  };

  return (
    <View>
      <ImageBackground source={background} style={styles.back}>
        <Titulo title='NOTIFICACIONES' />
        <View style={styles.container}>
          <Boton
            icono={require('../../../assets/Iconos/EDITAR_FOTO.png')}
            titulo='PERMISO CIRUCLACIÓN'
            onPress={() => showCalendar(1)}
            fontSize={15}
            value={date1.toLocaleDateString()}
          />
          <Boton
            icono={require('../../../assets/Iconos/EDITAR_FOTO.png')}
            titulo='REVISIÓN TÉCNICA'
            onPress={() => showCalendar(2)}
            fontSize={15}
            value={date2.toLocaleDateString()}
          />
        </View>

        <View style={styles.container}></View>
        <Calendario
          isDatePickerVisible={isDatePickerVisible}
          setDatePickerVisible={setDatePickerVisible}
          setDate1={setDate1}
          date1={date1}
          setDate2={setDate2}
          date2={date2}
          index={index}
        />
        <MenuFlotante />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    height: '100%',
  },
  container: {
    flexDirection: 'row',
  },
});
