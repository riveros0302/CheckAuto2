import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';

export default function TestNotification() {
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const scheduleNotification = async () => {
    if (selectedTime) {
      const now = new Date();
      const selectedDateTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      // Calcula el tiempo en segundos hasta la hora seleccionada
      const secondsDiff = Math.floor((selectedDateTime - now) / 1000);

      if (secondsDiff > 0) {
        const notificationContent = {
          title: 'Título de la Notificación',
          body: 'Cuerpo de la notificación',
          data: { anyData: 'additional data' }, // Datos adicionales que desees incluir
        };

        // Programa la notificación con el tiempo en segundos
        await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: { seconds: secondsDiff },
        });
      }
    }
  };

  return (
    <View>
      <Button title='Seleccionar Hora' onPress={showTimePicker} />
      {selectedTime && (
        <Text>Hora Seleccionada: {selectedTime.toLocaleTimeString()}</Text>
      )}

      <Button title='Programar Notificación' onPress={scheduleNotification} />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode='time'
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </View>
  );
}
