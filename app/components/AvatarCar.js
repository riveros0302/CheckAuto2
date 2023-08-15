import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { isEmpty } from 'lodash';
import { updateUrlAuto } from '../utils/Database/auto';
//import { collection, query, where, getDocs } from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import ImageResizer from 'react-native-image-resizer';
/*import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';*/
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { botoncolor } from '../utils/tema';

export default function AvatarCar(props) {
  const { vehiculo, setVehiculo, profile, setProfile, isPrincipal } = props;

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

        //--------------subimos la imagen a storage--------------------------------
        const uploadUrl = await uploadImage(newUri);
        getUrl('url', uploadUrl);
        setProfile(uploadUrl);
        filterAuto(uploadUrl);
        setLoading(false);
        //-------------------------------------------------------------------------

        // setLoading(false);
      } catch (error) {
        console.log('eeerror: ' + error);
        // toastRef.current.show('Error al actualizar tu foto de perfil');
      }
    }
  };

  const uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const storageRef = storage().ref(`Avatar/${auth().currentUser.uid}`);
      await storageRef.put(blob);

      blob.close();

      return await storageRef.getDownloadURL();
    } catch (error) {
      throw new Error(
        'Error al subir la imagen a Firebase Storage: ' + error.message
      );
    }
  };

  const filterAuto = async (url) => {
    try {
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid);

      const querySnapshot = await q.get();
      querySnapshot.forEach(async (doc) => {
        // doc.data() nunca es indefinido para instantáneas de consulta de documentos
        await doc.ref.update({
          url: url, // Actualiza el campo "url" en el documento
        });

        // Aquí llamamos a la función updateUrlAuto con los parámetros necesarios
        await updateUrlAuto(doc.id, url);
      });
    } catch (error) {
      throw new Error(
        'Error al filtrar y actualizar los datos de los autos: ' + error.message
      );
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
            onPress={pickImage}
            style={{ backgroundColor: 'grey' }}
          />
        </Avatar>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
