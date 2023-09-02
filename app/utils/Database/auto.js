/*import {
  addDoc,
  collection,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';*/
import { Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

export const insertAuto = async (vehiculo, isUpdate) => {
  try {
    // Obtener el UID del usuario actual
    const currentUserUid = auth().currentUser.uid;

    // Consultar la colección "car" para obtener la cantidad de documentos con el mismo UID
    const q = firestore()
      .collection('car')
      .where('createBy', '==', currentUserUid);
    const querySnapshot = await q.get();
    const documentosConMismoUid = querySnapshot.size;
    const lastindex = await getLastIndexForUser();
    console.log('lasindex: ' + lastindex);
    const indexfinal =
      lastindex == null ? 0 : isUpdate ? lastindex : lastindex + 1;
    console.log('cual es el last index?: ' + indexfinal);

    // Crear un nombre para el documento combinando el UID y el índice
    const documentoNombre = `${indexfinal}_${currentUserUid}`;

    // Crear un objeto con los campos comunes
    const vehiculoData = {
      Marca: vehiculo.Marca,
      Modelo: vehiculo.Modelo,
      Año: vehiculo.Año,
      createBy: currentUserUid,
      device: Platform.OS,
      Index: indexfinal,
      Patente: vehiculo.Patente,
      Tipo: vehiculo.Tipo,
      Combustible: vehiculo.Combustible,
      Aire: vehiculo.Aire,
      Rueda: vehiculo.Rueda,
      Luces: vehiculo.Luces,
      Transmision: vehiculo.Transmision,
      Motor: vehiculo.Motor,
      Autonomia: vehiculo.Autonomia,
      Numero_Motor: vehiculo.N_motor,
      Numero_Chasis: vehiculo.N_chasis,
      documentos: {
        licencia_Conducir: '',
        permiso_Circulacion: '',
        soap: '',
        revision_Tecnica: '',
        inscripcion: '',
        otros: '',
        padron: '',
      },
    };

    if (!isUpdate) {
      // Si no es una actualización (isUpdate es false), agrega url_foto
      vehiculoData.url_foto = vehiculo.url;
    }

    // Añadir un nuevo documento en la colección "car" con el nombre de documento personalizado
    await firestore()
      .collection('car')
      .doc(documentoNombre) // Usar el nombre de documento personalizado
      .set(vehiculoData, { merge: true }); // Usa merge: true para mantener los campos existentes si isUpdate es true
  } catch (error) {
    throw error;
  }
};

export const updateUrlAuto = async (docId, url) => {
  try {
    const carDocRef = firestore().collection('car').doc(docId);

    await carDocRef.update({
      url_foto: url,
    });
  } catch (error) {
    throw new Error(
      'Error al actualizar el campo "url_foto" del auto: ' + error.message
    );
  }
};

export const updateAuto = async (campo, value, index) => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid)
        .where('Index', '==', index);

      const querySnapshot = await q.get();
      const updatePromises = [];

      querySnapshot.forEach((doc) => {
        updatePromises.push(dataUpdate(doc.id, campo, value));
      });

      await Promise.all(updatePromises);

      resolve('Actualización exitosa');
    } catch (error) {
      reject(error);
    }
  });
};

const dataUpdate = async (docId, campo, value) => {
  try {
    const dataToUpdate = {};
    dataToUpdate[campo] = value;

    await firestore().collection('car').doc(docId).update(dataToUpdate);
  } catch (error) {
    throw error;
  }
};

export const checkIfUserExists = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtén el UID del usuario actual
      const currentUserUid = auth().currentUser.uid;

      // Consulta la colección "car" para documentos con el mismo UID
      const q = firestore()
        .collection('car')
        .where('createBy', '==', currentUserUid);

      const querySnapshot = await q.get();
      resolve(querySnapshot.size === 0); // Resuelve true si no hay documentos
    } catch (error) {
      reject(error);
    }
  });
};

export const getDataCarByUserId = () => {
  return new Promise(async (resolve, reject) => {
    const q = query(
      collection(db, 'car'),
      where('createBy', '==', auth().currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      resolve(doc.data());
    });
  });
};

export const getDataCarByUserIdAndIndex = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtén el UID del usuario actual
      const currentUserUid = auth().currentUser.uid;

      // Consulta la colección "car" para documentos con el mismo UID y el índice proporcionado
      const q = firestore()
        .collection('car')
        .where('createBy', '==', currentUserUid)
        .where('Index', '==', index);

      const querySnapshot = await q.get();
      const carData = [];

      querySnapshot.forEach((doc) => {
        resolve(doc.data());
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getInfoAutoIndex = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid)
        .where('Index', '==', index);

      const querySnapshot = await q.get();
      const carData = [];

      querySnapshot.forEach((doc) => {
        carData.push(doc.data());
      });

      resolve(carData);
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllDataCarByUserId = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid);

      const querySnapshot = await q.get();
      const cars = []; // Array para almacenar los datos de los autos

      querySnapshot.forEach((doc) => {
        cars.push(doc.data());
      });

      resolve(cars); // Resuelve la promesa con el array de autos
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllDataCarByUserIdAndIndex = (index) => {
  return new Promise(async (resolve, reject) => {
    const q = query(
      collection(db, 'car'),
      where('createBy', '==', auth().currentUser.uid),
      where('Index', '==', index)
    );

    const querySnapshot = await getDocs(q);
    const cars = []; // Array para almacenar los datos de los autos

    querySnapshot.forEach((doc) => {
      cars.push(doc.data());
    });

    resolve(cars); // Resuelve la promesa con el array de autos
  });
};

export const getFirstDataCarByUserId = () => {
  return new Promise(async (resolve, reject) => {
    const Lowindex = await getLowestIndex();
    try {
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid)
        .where('Index', '==', Lowindex);

      const querySnapshot = await q.get();
      const cars = []; // Array para almacenar los datos de los autos

      querySnapshot.forEach((doc) => {
        cars.push(doc.data());
      });

      resolve(cars); // Resuelve la promesa con el array de autos
    } catch (error) {
      reject(error);
    }
  });
};

export const searchFirebase = async (searchText) => {
  try {
    const q = firestore()
      .collection('car')
      .where('createBy', '==', auth().currentUser.uid); // Buscar documentos del usuario actual

    const querySnapshot = await q.get();

    if (!querySnapshot.empty) {
      const document = querySnapshot.docs[0];

      return new Promise(async (resolve, reject) => {
        try {
          if (!searchText || !document.id) {
            // Si searchText o documentId están vacíos, no realizar la consulta y retornar un arreglo vacío
            resolve([]);
            return;
          }

          const docRef = firestore().doc(`car/${document.id}`);
          const docSnapshot = await docRef.get();

          if (docSnapshot.exists) {
            const data = docSnapshot.data();
            const normalizedSearchText =
              searchText.charAt(0).toUpperCase() +
              searchText.slice(1).toLowerCase();
            const fieldValue = data[normalizedSearchText];

            if (fieldValue !== undefined) {
              const result = { [normalizedSearchText]: fieldValue };
              resolve([result]);
            } else {
              resolve([]);
            }
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(error);
        }
      });
    } else {
      // Si no se encontraron documentos
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getDocsByUser = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Consultar la colección "car" para obtener los documentos que cumplan las condiciones
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid)
        .where('Index', '==', index);

      const querySnapshot = await q.get();
      const documents = querySnapshot.docs.map((doc) => doc.data().documentos);
      const separatedDocuments = Object.keys(documents[0]).map((key) => ({
        [key]: documents[0][key],
      }));

      resolve(separatedDocuments);
    } catch (error) {
      reject(error);
    }
  });
};

export const uploadPDFToFirebase = async (pdfBlobURL, index, titulo) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (pdfBlobURL) {
        const reference = storage().ref(
          `Documentos/${auth().currentUser.uid}/${titulo}_${index}`
        );
        await reference.putFile(pdfBlobURL);

        const downloadURL = await reference.getDownloadURL();

        const q = firestore()
          .collection('car')
          .where('createBy', '==', auth().currentUser.uid)
          .where('Index', '==', index);

        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
          console.log('No se encontró el documento en Firestore');
          return reject(
            new Error(
              'No se encontró el documento en Firestore desde la funcion uploadPDFToFirebase()'
            )
          );
        }

        const carDocRef = querySnapshot.docs[0].ref;
        const carDocSnapshot = await carDocRef.get();

        if (!carDocSnapshot.exists) {
          console.log('El documento no existe en Firestore');
          return reject(
            new Error(
              'El documento no existe en Firestore desde la funcion uploadPDFToFirebase()'
            )
          );
        }

        const carData = carDocSnapshot.data();
        const documentosData = carData.documentos || {};
        documentosData[titulo] = downloadURL;

        await carDocRef.update({
          documentos: documentosData,
        });

        console.log('Documento actualizado exitosamente.');
        resolve(downloadURL);
      } else {
        console.log('No PDF selected.');
        reject(new Error('No PDF selected.'));
      }
    } catch (error) {
      console.log('Error al subir el archivo PDF a Firebase Storage: ' + error);
      reject(error);
    }
  });
};

export const getURLFromFirestore = async (index, nameDoc) => {
  try {
    // Consultar la colección "car" para obtener el documento que cumpla las condiciones
    const q = firestore()
      .collection('car')
      .where('createBy', '==', auth().currentUser.uid)
      .where('Index', '==', index);

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      throw new Error('No se encontró el documento en Firestore');
    }

    const carDocRef = querySnapshot.docs[0].ref;
    const carDocSnapshot = await carDocRef.get();

    if (!carDocSnapshot.exists) {
      throw new Error('El documento no existe en Firestore');
    }

    // Obtener la URL del subcampo específico en el campo "documentos"
    const documentosData = carDocSnapshot.data().documentos;

    if (documentosData && documentosData[nameDoc]) {
      return documentosData[nameDoc];
    } else {
      throw new Error('No se encontró la URL en Firestore');
    }
  } catch (error) {
    throw new Error(
      'Error al obtener la URL desde Firestore: ' + error.message
    );
  }
};

export const deleteCar = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Consultar la colección "car" para obtener el documento que cumpla las condiciones
      const q = firestore()
        .collection('car')
        .where('createBy', '==', auth().currentUser.uid)
        .where('Index', '==', index);

      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        reject(new Error('No se encontró el documento en Firestore'));
        return;
      }

      const carDocRef = querySnapshot.docs[0].ref;
      await carDocRef.delete();

      resolve('El documento fue eliminado correctamente.');
    } catch (error) {
      reject(new Error('Error al eliminar el documento: ' + error.message));
    }
  });
};

export const getLastIndexForUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const carCollection = firestore().collection('car');
      const querySnapshot = await carCollection
        .where('createBy', '==', auth().currentUser.uid)
        .orderBy('Index', 'desc')
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        // Si hay documentos en la colección, obtenemos el máximo ID_AUTO
        const maxIdAutoDoc = querySnapshot.docs[0].data();
        const maxIdAuto = maxIdAutoDoc.Index;
        resolve(maxIdAuto); // Resuelve la promesa con el ID_AUTO más alto
      } else {
        // Si no hay documentos en la colección, establecemos un valor predeterminado (puedes ajustarlo según tus necesidades)
        const defaultValue = null;
        resolve(defaultValue); // Resuelve la promesa con el valor predeterminado
      }
    } catch (error) {
      console.error('Error al obtener el idAuto más alto:', error);
      reject(error); // Rechaza la promesa y lanza el error para manejarlo en un nivel superior
    }
  });
};

export const getLowestIndex = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userId = auth().currentUser.uid;

      // Consultar la colección "car" para obtener los documentos del usuario ordenados por Index
      const querySnapshot = await firestore()
        .collection('car')
        .where('createBy', '==', userId)
        .orderBy('Index')
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const firstCarDoc = querySnapshot.docs[0];
        const lowestIndex = firstCarDoc.data().Index;
        resolve(lowestIndex);
      } else {
        // No se encontraron documentos para el usuario
        resolve(0); // O cualquier valor que consideres apropiado
      }
    } catch (error) {
      console.error('Error fetching lowest index:', error);
      reject(error);
    }
  });
};
