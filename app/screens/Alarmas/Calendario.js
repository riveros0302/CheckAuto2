import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Modal from '../../components/Modal';
import { primary } from '../../utils/tema';
import { addDate1ToUser, addDate2ToUser } from '../../utils/Database/users';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

LocaleConfig.locales['es'] = {
  monthNames: [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ],
  monthNamesShort: [
    'Ene.',
    'Feb.',
    'Mar.',
    'Abr.',
    'May.',
    'Jun.',
    'Jul.',
    'Ago.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dic.',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export default function Calendario(props) {
  const {
    setDatePickerVisible,
    isDatePickerVisible,
    setDate1,
    date1,
    index,
    setDate2,
    date2,
    indexCar,
  } = props;

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [fecha, setFecha] = useState('');
  const [date, setDate] = useState(null);

  /* const showDatePicker = () => {
    setDatePickerVisible(true);
  };*/
  const localnotification1 = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const triggerTime = new Date(date1);
    triggerTime.setHours(9, 0, 0); // Establecer la hora a las 9:00 PM

    const secondsDiff = Math.floor((triggerTime - now) / 1000);
    // Si la diferencia es negativa, agrega un día en segundos

    console.log('Diferencia en segundos:', secondsDiff);

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Permiso de Circulación',
        body: 'Hola, recuerda sacar tu permiso de circulación',
      },
      trigger: {
        seconds: secondsDiff,
      },
    });
  };

  const localnotification2 = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);

    // Convierte la cadena date1 en un objeto de fecha
    const date2Obj = new Date(date2);
    date2Obj.setHours(9, 0, 0); // Establecer la hora a las 9:00 AM
    const triggerTime = date2Obj.getTime(); // Obtén el tiempo seleccionado en milisegundos

    const secondsDiff = Math.floor((triggerTime - now) / 1000);
    console.log(secondsDiff);

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Revisión Técnica',
        body: 'Hola, recuerda ir a la Revisión Técnica este mes',
      },
      trigger: {
        seconds: secondsDiff,
      },
    });
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    switch (index) {
      case 1:
        localnotification1();
        break;
      case 2:
        localnotification2();
        break;

      default:
        break;
    }
  };

  const handleDateConfirm = () => {
    if (date) {
      switch (index) {
        case 1:
          setDate1(date);
          addDate1ToUser(date, indexCar);
          break;
        case 2:
          setDate2(date);
          addDate2ToUser(date, indexCar);
          break;

        default:
          break;
      }
    }
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  return (
    <Modal
      isVisible={isDatePickerVisible}
      close={true}
      colorModal={primary}
      setIsVisible={setDatePickerVisible}
    >
      <View>
        <Text
          style={{
            fontSize: 25,
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 20,
          }}
        >
          SELECCIONA UNA FECHA
        </Text>
        <Calendar
          style={{ backgroundColor: primary }}
          onDayPress={(day) => {
            setFecha(day.dateString);
            setDate(day.dateString);
          }}
          firstDay={1}
          disableAllTouchEventsForDisabledDays={true}
          enableSwipeMonths
          hideExtraDays
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: 'white',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: primary,
            selectedDayTextColor: 'white',
            todayTextColor: primary,
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: primary,
            selectedDotColor: '#ffffff',
            arrowColor: 'white',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'white',
            indicatorColor: 'blue',
            textMonthFontFamily: 'monospace',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 16,
          }}
          markedDates={{
            [fecha]: {
              selected: true,
              marked: false,
              selectedColor: primary,
            },
          }}
        />
        <Button
          title={'Confirmar'}
          buttonStyle={{ backgroundColor: primary, marginVertical: 10 }}
          onPress={handleDateConfirm}
          disabled={date ? false : true}
          disabledStyle={{ backgroundColor: primary }}
        />

        {/* <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode='date'
        value={index == 1 ? date1 : date2} // Agrega la prop value con el valor de fecha actual
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode='time'
        value={index == 1 ? date1 : date2} // Agrega la prop value con el valor de fecha actual
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />*/}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
