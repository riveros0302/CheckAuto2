import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import ImageResizer from 'react-native-image-resizer';
import { uploadImage, filterAuto } from '../utils/uploadPhoto';

export default function AvatarCar(props) {
  const { vehiculo, setVehiculo, profile, setProfile, isPrincipal, index } =
    props;

  const [loading, setLoading] = useState(false);

  const resizeImage = async (uri, width, height, format, quality) => {
    const response = await ImageResizer.createResizedImage(
      uri,
      width,
      height,
      format,
      quality
    );
    return response.uri;
  };

  const permissionStorage = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    if (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('Permisos concedidos: cámara y almacenamiento');
      pickImage();
    } else {
      console.log('Al menos uno de los permisos fue denegado');
    }
  };

  const pickImage = async () => {
    setLoading(true);
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled) {
      // toastRef.current.show('Has cerrado la seleccion de imagenes');
      setLoading(false);
    } else {
      try {
        // Reducir el tamaño de la imagen
        const newUri = await resizeImage(
          result.assets[0].uri,
          800,
          600,
          'JPEG',
          50
        );

        //--------------subimos la imagen a storage siempre y cuando esté en Principal--------------------------------

        const uploadUrl = await uploadImage(newUri, index);
        getUrl('url', uploadUrl);
        setProfile(uploadUrl);
        filterAuto(uploadUrl, index);
        setLoading(false);

        //-------------------------------------------------------------------------

        // setLoading(false);
      } catch (error) {
        console.log('eeerror: ' + error);
        // toastRef.current.show('Error al actualizar tu foto de perfil');
      }
    }
  };

  const getUrl = async (type, url) => {
    await setVehiculo({ ...vehiculo, [type]: url });
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size='large' color='blue' />
      ) : (
        <Avatar
          size={isPrincipal ? 170 : 150}
          rounded
          source={
            profile
              ? { uri: profile }
              : require('../../assets/Iconos/EDITAR_FOTO.png')
          }
        >
          <Avatar.Accessory
            size={30}
            onPress={permissionStorage}
            style={{ backgroundColor: 'grey' }}
          />
        </Avatar>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
