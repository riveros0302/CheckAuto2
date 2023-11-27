import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { updateUrlAuto } from './Database/auto';
import RNFetchBlob from 'rn-fetch-blob';

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

export const uploadImageDocument = async (uri, index, titulo) => {
  try {
    // Verificar si existe un PDF con el mismo título
    const storageRefPdf = storage().ref(
      `Documentos/${auth().currentUser.uid}/${titulo}_${index}_pdf`
    );

    const pdfExists = await storageRefPdf
      .getDownloadURL()
      .then(() => true)
      .catch(() => false);

    // Si hay un PDF con el mismo título, eliminarlo
    if (pdfExists) {
      await storageRefPdf.delete();
      console.log('PDF existente eliminado.');
    }

    const storageRefImage = storage().ref(
      `Documentos/${auth().currentUser.uid}/${titulo}_${index}_image`
    );

    // Verificar si la imagen ya existe
    const imageExists = await storageRefImage
      .getDownloadURL()
      .then(() => true)
      .catch(() => false);

    // Si la imagen ya existe, la reemplazamos
    if (imageExists) {
      console.log('La imagen ya existe en Firebase Storage. Reemplazándola...');

      // Eliminar la imagen existente
      await storageRefImage.delete();

      // Subir la nueva imagen
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed: ' + JSON.stringify(e)));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      await storageRefImage.put(blob);
      blob.close();

      const downloadUrlImage = await storageRefImage.getDownloadURL();

      // Guardar la URL de la imagen en Firestore
      const currentUserUid = auth().currentUser.uid;
      const carRef = firestore().collection('car');
      const carQuery = carRef
        .where('createBy', '==', currentUserUid)
        .where('Index', '==', index);

      const carSnapshot = await carQuery.get();
      if (!carSnapshot.empty) {
        const carDocRef = carRef.doc(`${index}_${currentUserUid}`);

        // Actualizar el campo en 'documentos' con la URL de descarga de la imagen
        await carDocRef.update({
          [`documentos.${titulo}`]: downloadUrlImage,
        });
      }

      return downloadUrlImage;
    } else {
      // La imagen no existe, la subimos
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed: ' + JSON.stringify(e)));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      await storageRefImage.put(blob);
      blob.close();

      const downloadUrl = await storageRefImage.getDownloadURL();

      // Guardar la URL en Firestore
      const currentUserUid = auth().currentUser.uid;
      const carRef = firestore().collection('car');
      const carQuery = carRef
        .where('createBy', '==', currentUserUid)
        .where('Index', '==', index);

      const carSnapshot = await carQuery.get();
      if (!carSnapshot.empty) {
        const carDocRef = carRef.doc(`${index}_${currentUserUid}`);

        // Actualizar el campo en 'documentos' con la URL de descarga
        await carDocRef.update({
          [`documentos.${titulo}`]: downloadUrl,
        });
      }

      return downloadUrl;
    }
  } catch (error) {
    throw new Error(
      'Error al subir la imagen a Firebase Storage: ' + error.message
    );
  }
};

export const downloadImage = async (
  pdfurl,
  imageUri,
  titulo,
  index,
  setReload,
  setTxtLoad
) => {
  setReload(true);
  setTxtLoad('Compartiendo Documento...');
  const { config, fs } = RNFetchBlob;
  const downloads = fs.dirs?.DownloadDir;
  const localFilePath = pdfurl
    ? downloads + '/' + titulo + index + auth().currentUser.uid + '.pdf'
    : downloads + '/' + titulo + index + auth().currentUser.uid + '.jpg';

  try {
    // Verificar si el archivo ya existe en la ubicación local
    const fileExists = await fs.exists(localFilePath);

    if (fileExists) {
      console.log('Archivo existente encontrado, eliminando:', localFilePath);

      // Eliminar el archivo existente
      await fs.unlink(localFilePath);

      console.log('Archivo eliminado localmente.');
    }

    console.log('Descargando archivo...');
    // Descargar el archivo (como en tu código original)
    const res = await config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: localFilePath,
      },
    }).fetch('GET', pdfurl ? pdfurl.uri : imageUri);

    console.log('Archivo descargado correctamente:', res.path());
    return res.path(); // Devolver la ruta del archivo descargado
  } catch (error) {
    console.error('Error al descargar o enviar el archivo:', error);
    throw error;
  }
};

//EL CODIGO SIGUIENTE ES EL ANITGUO POR SI EL QUE ESTA ARRIBA FALLA O TIENE ALGO QUE NO TOMAMOS EN CUENTA
/*export const downloadImage = async (
  pdfurl,
  imageUri,
  titulo,
  index,
  setReload,
  setTxtLoad
) => {
  setReload(true);
  setTxtLoad('Compartiendo Documento...');
  const { config, fs } = RNFetchBlob;
  const downloads = fs.dirs?.DownloadDir;
  const localFilePath = pdfurl
    ? downloads + '/' + titulo + index + auth().currentUser.uid + '.pdf'
    : downloads + '/' + titulo + index + auth().currentUser.uid + '.jpg';

  try {
    // Verificar si el archivo ya existe en la ubicación local
    const fileExists = await fs.exists(localFilePath);

    if (fileExists) {
      console.log('Archivo existente encontrado, enviando:', localFilePath);
      return localFilePath; // Devolver la ruta del archivo existente
    } else {
      console.log('Archivo no encontrado localmente, descargando...');
      // Descargar el archivo si no existe localmente
      const res = await config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: localFilePath,
        },
      }).fetch('GET', pdfurl ? pdfurl.uri : imageUri);

      console.log('Archivo descargado correctamente:', res.path());
      return res.path(); // Devolver la ruta del archivo descargado
    }
  } catch (error) {
    console.error('Error al descargar o enviar el archivo:', error);
    throw error;
  }
};*/
