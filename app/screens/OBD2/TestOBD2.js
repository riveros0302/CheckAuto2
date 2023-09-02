import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BleManager } from 'react-native-ble-plx';

export default function TestOBD2() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState('');

  let bleManager = null;

  useEffect(() => {
    // Inicializar el BleManager cuando se monta el componente
    bleManager = new BleManager();

    // Escanear dispositivos BLE
    const scanDevices = () => {
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Error scanning:', error);
          return;
        }

        if (device.name && device.name.includes('OBDII')) {
          setDevices((prevDevices) => [...prevDevices, device]);
        }
      });
    };

    scanDevices();

    return () => {
      // Detener el escaneo y desconectar el dispositivo cuando se desmonta el componente
      bleManager.stopDeviceScan();
      disconnectDevice();
    };
  }, []);

  const connectDevice = async (device) => {
    try {
      await device.connect();
      setConnectedDevice(device);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        await connectedDevice.cancelConnection();
      } catch (error) {
        console.error('Error disconnecting from device:', error);
      }
    }
  };

  const fetchVehicleData = async () => {
    if (!connectedDevice) {
      console.error('No connected device.');
      return;
    }

    // Resto del código para obtener datos del vehículo
    // ...

    setData(fetchedData);
  };

  return <View>{/* Resto del JSX */}</View>;
}

const styles = StyleSheet.create({});
