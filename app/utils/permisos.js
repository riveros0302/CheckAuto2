import { PermissionsAndroid } from 'react-native';
import React from 'react';

export const Permission = await PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  {
    title: 'Location Permission',
    message: 'Bluetooth Low Energy requires Location',
    buttonPositive: 'OK',
  }
);

export const requestStoragePermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permiso de almacenamiento',
          message:
            'La aplicación necesita acceso al almacenamiento para guardar archivos.',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permiso de almacenamiento concedido');
        resolve(true); // Resuelve la promesa con true si se concede el permiso
      } else {
        console.log('Permiso de almacenamiento denegado');
        resolve(false); // Resuelve la promesa con false si se deniega el permiso
      }
    } catch (error) {
      console.error('Error al solicitar permiso de almacenamiento:', error);
      reject(error); // Rechaza la promesa en caso de error
    }
  });
};
