import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { StyleSheet, View, Button, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldShowAlert: true,
    };
  },
});

export default function Calendario(props) {
  const {
    setDatePickerVisible,
    isDatePickerVisible,
    setDate1,
    date1,
    index,
    setDate2,
    date2,
  } = props;

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  /* const showDatePicker = () => {
    setDatePickerVisible(true);
  };*/
  const localnotification1 = () => {
    const now = new Date().getTime(); // Obtén el tiempo actual en milisegundos
    const triggerTime = new Date(date1).getTime(); // Obtén el tiempo seleccionado en milisegundos
    const secondsDiff = Math.floor((triggerTime - now) / 1000);
    console.log(secondsDiff);

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
    const now = new Date().getTime(); // Obtén el tiempo actual en milisegundos
    const triggerTime = new Date(date2).getTime(); // Obtén el tiempo seleccionado en milisegundos
    const secondsDiff = Math.floor((triggerTime - now) / 1000);

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Revisión Técnica',
        body: 'Hola, recuerda ir a la revisión Técnica este mes',
      },
      trigger: {
        seconds: secondsDiff,
      },
    });
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    showTimePicker();
  };

  const handleDateConfirm = (selectedDate) => {
    if (selectedDate) {
      switch (index) {
        case 1:
          setDate1(selectedDate);
          break;
        case 2:
          setDate2(selectedDate);
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

  const handleTimeConfirm = (selectedTime) => {
    if (selectedTime) {
      switch (index) {
        case 1:
          const newDate1 = date1;
          console.log(newDate1);
          newDate1.setHours(selectedTime.getHours());
          newDate1.setMinutes(selectedTime.getMinutes());
          newDate1.setSeconds(0);
          setDate1(newDate1);
          break;
        case 2:
          const newDate2 = date2;
          console.log(newDate2);
          newDate2.setHours(selectedTime.getHours());
          newDate2.setMinutes(selectedTime.getMinutes());
          newDate2.setSeconds(0);
          setDate2(newDate2);
          break;

        default:
          break;
      }
    }
    hideTimePicker();
  };

  return (
    <View>
      <DateTimePickerModal
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
      />
    </View>
  );
}

const styles = StyleSheet.create({});
