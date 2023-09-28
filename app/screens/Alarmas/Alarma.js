import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-elements';
import { background } from '../../utils/tema';
import MenuFlotante from '../../components/MenuFlotante';
import Titulo from '../../components/Titulo';
import Boton from '../../components/Boton';
import Calendario from './Calendario';
import { getDatesFromUser } from '../../utils/Database/users';

export default function Alarma(props) {
  const { route } = props;
  const { index } = route.params;
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [indexNot, setIndexNot] = useState();

  const showCalendar = (id) => {
    setDatePickerVisible(true);
    setIndexNot(id);
  };

  useEffect(() => {
    const getDatesFirebase = async () => {
      try {
        const { date1, date2 } = await getDatesFromUser(index);
        setDate1(date1);
        setDate2(date2);
      } catch (error) {}
    };
    getDatesFirebase();
  }, []);

  return (
    <View>
      <ImageBackground source={background} style={styles.back}>
        <Titulo title='NOTIFICACIONES' />
        <View>
          <View style={styles.container}>
            <Boton
              icono={require('../../../assets/Iconos/CIRCULACION.png')}
              titulo='PERMISO CIRUCLACIÓN'
              onPress={() => showCalendar(1)}
              fontSize={15}
              value={date1 instanceof Date ? '' : date1}
              isNotification={true}
            />
            <Boton
              icono={require('../../../assets/Iconos/REVISION_TEC.png')}
              titulo='REVISIÓN TÉCNICA'
              onPress={() => showCalendar(2)}
              fontSize={15}
              value={date2 instanceof Date ? '' : date2}
              isNotification={true}
            />
          </View>
        </View>

        <View style={styles.container}></View>
        <Calendario
          isDatePickerVisible={isDatePickerVisible}
          setDatePickerVisible={setDatePickerVisible}
          setDate1={setDate1}
          date1={date1}
          setDate2={setDate2}
          date2={date2}
          index={indexNot}
          indexCar={index}
        />

        <MenuFlotante isNotification={true} />
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
