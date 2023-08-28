import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { isEmpty } from 'lodash';
import { updateUrlAuto } from '../utils/Database/auto';
import firestore from '@react-native-firebase/firestore';
import ImageResizer from 'react-native-image-resizer';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { botoncolor } from '../utils/tema';

export default function AvatarCuestionario(props) {
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

        //---------------------------------------------

        setProfile(newUri);

        setLoading(false);

        //-------------------------------------------------------------------------

        // setLoading(false);
      } catch (error) {
        console.log('eeerror: ' + error);
        // toastRef.current.show('Error al actualizar tu foto de perfil');
      }
    }
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
            onPress={pickImage}
            style={{ backgroundColor: 'grey' }}
          />
        </Avatar>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
