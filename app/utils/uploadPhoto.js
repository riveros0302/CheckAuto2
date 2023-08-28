import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateUrlAuto } from './Database/auto';

export const uploadImage = async (uri, index) => {
  console.log('INDEXX TIENE: ' + index);
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

    const storageRef = storage().ref(
      `Avatar/${auth().currentUser.uid}/${auth().currentUser.uid}_${index}`
    );
    await storageRef.put(blob);

    blob.close();

    return await storageRef.getDownloadURL();
  } catch (error) {
    throw new Error(
      'Error al subir la imagen a Firebase Storage: ' + error.message
    );
  }
};

export const filterAuto = async (url, index) => {
  console.log('INDEXX ACTUALIZA CON: ' + index);
  try {
    const q = firestore()
      .collection('car')
      .where('createBy', '==', auth().currentUser.uid)
      .where('Index', '==', index);

    const querySnapshot = await q.get();
    querySnapshot.forEach(async (doc) => {
      // doc.data() nunca es indefinido para instantáneas de consulta de documento
      await doc.ref.update({
        url_foto: url, // Actualiza el campo "url" en el documento
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
