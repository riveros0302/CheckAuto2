import { Platform } from "react-native";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const insertAuto = async (vehiculo, isUpdate, indexfinal, isNew) => {
  //el index que recibimos aqui es para identificar el auto que esta seleccionado ya que en esta funcion arrojará siempre el ultimo index lo cual no siempre se necesita
  try {
    // Obtener el UID del usuario actual
    const currentUserUid = auth().currentUser.uid;

    // Consultar la colección "car" para obtener la cantidad de documentos con el mismo UID
    const q = firestore()
      .collection("car")
      .where("createBy", "==", currentUserUid)
      .where("Index", "==", indexfinal);

    console.log("cual es el last index?: " + indexfinal);
    console.log("VEHICULO VIENE CON: " + JSON.stringify(vehiculo));

    // Crear un nombre para el documento combinando el UID y el índice
    const documentoNombre = `${indexfinal}_${currentUserUid}`;

    // Crear un objeto con los campos comunes
    const vehiculoData = {
      Propietario: vehiculo.Propietario,
      Rut: vehiculo.Rut,
      Direccion: vehiculo.Direccion,
      Marca: vehiculo.Marca,
      Modelo: vehiculo.Modelo,
      Año: vehiculo.Año,
      Color: vehiculo.Color,
      createBy: currentUserUid,
      device: Platform.OS,
      Index: indexfinal,
      Patente: vehiculo.Patente,
      Tipo: vehiculo.Tipo,
      Combustible: vehiculo.Combustible,
      Aceite: vehiculo.Aceite,
      Aire: vehiculo.Aire,
      Rueda: vehiculo.Rueda,
      Luces: vehiculo.Luces,
      Transmision: vehiculo.Transmision,
      Motor: vehiculo.Motor,
      Rendimiento: vehiculo.Rendimiento,
      Numero_Motor: vehiculo.Numero_Motor,
      Numero_Chasis: vehiculo.Numero_Chasis,
      documentos: {
        licencia_Conducir: isNew
          ? ""
          : vehiculo.documentos
          ? vehiculo.documentos.licencia_Conducir
          : "",
        permiso_Circulacion: isNew
          ? ""
          : vehiculo.documentos
          ? vehiculo.documentos.permiso_Circulacion
          : "",
        soap: isNew ? "" : vehiculo.documentos ? vehiculo.documentos.soap : "",
        revision_Tecnica: isNew
          ? ""
          : vehiculo.documentos
          ? vehiculo.documentos.revision_Tecnica
          : "",
        inscripcion: isNew
          ? ""
          : vehiculo.documentos
          ? vehiculo.documentos.inscripcion
          : "",
        otros: isNew
          ? ""
          : vehiculo.documentos
          ? vehiculo.documentos.otros
          : "",
        padron: isNew
          ? ""
          : vehiculo.documentos
          ? vehiculo.documentos.padron
          : "",
      },
    };

    if (!isUpdate) {
      // Si no es una actualización (isUpdate es false), agrega url_foto
      vehiculoData.url_foto = vehiculo.url;
    }

    // Añadir un nuevo documento en la colección "car" con el nombre de documento personalizado
    await firestore()
      .collection("car")
      .doc(documentoNombre) // Usar el nombre de documento personalizado
      .set(vehiculoData, { merge: true }); // Usa merge: true para mantener los campos existentes si isUpdate es true
  } catch (error) {
    throw error;
  }
};

export const updateUrlAuto = async (docId, url) => {
  try {
    const carDocRef = firestore().collection("car").doc(docId);

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
        .collection("car")
        .where("createBy", "==", auth().currentUser.uid)
        .where("Index", "==", index);

      const querySnapshot = await q.get();
      const updatePromises = [];

      querySnapshot.forEach((doc) => {
        updatePromises.push(dataUpdate(doc.id, campo, value));
      });

      await Promise.all(updatePromises);

      resolve("Actualización exitosa");
    } catch (error) {
      reject(error);
    }
  });
};

const dataUpdate = async (docId, campo, value) => {
  try {
    const dataToUpdate = {};
    dataToUpdate[campo] = value;

    await firestore().collection("car").doc(docId).update(dataToUpdate);
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
        .collection("car")
        .where("createBy", "==", currentUserUid);

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
      collection(db, "car"),
      where("createBy", "==", auth().currentUser.uid)
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
        .collection("car")
        .where("createBy", "==", currentUserUid)
        .where("Index", "==", index);

      const querySnapshot = await q.get();
      const carData = [];

      querySnapshot.forEach((doc) => {
        resolve(doc.data());
        //  console.log("RECIBO: " + JSON.stringify(doc.data()));
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
        .collection("car")
        .where("createBy", "==", auth().currentUser.uid)
        .where("Index", "==", index);

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

export const getAllDataCarByUserId = (num) => {
  return new Promise(async (resolve, reject) => {
    try {
      let q = firestore()
        .collection("car")
        .where("createBy", "==", auth().currentUser.uid);

      if (num) {
        // Consultar el número total de documentos
        const totalDocs = await q.get().then((snapshot) => snapshot.size);

        // Si hay más documentos que el número deseado (num), limita la consulta a num documentos
        if (totalDocs > num) {
          q = q.limit(num);
        }
      }

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
      collection(db, "car"),
      where("createBy", "==", auth().currentUser.uid),
      where("Index", "==", index)
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
        .collection("car")
        .where("createBy", "==", auth().currentUser.uid)
        .where("Index", "==", Lowindex);

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

export function searchFirebase(searchText, index) {
  return new Promise((resolve, reject) => {
    const collectionRef = firestore().collection("car");

    // Realiza la consulta en Firestore
    const query = collectionRef
      .where("createBy", "==", auth().currentUser.uid)
      .where("Index", "==", index);

    query
      .get()
      .then((querySnapshot) => {
        if (searchText.trim() === "") {
          resolve([]); // Resuelve con un array vacío si searchText está vacío
        } else {
          const filteredData = [];

          querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Elimina la propiedad "documentos" del objeto y todos los que no quieres que aparescan en la busqueda
            delete data.documentos;
            delete data.device;
            delete data.createBy;
            delete data.Index;
            delete data.url_foto;

            // Filtra los datos basados en la clave de búsqueda
            const filteredItem = {};
            Object.keys(data).forEach((key) => {
              if (key.toLowerCase().includes(searchText.toLowerCase())) {
                filteredItem[key] = data[key];
              }
            });

            // Agrega el objeto filtrado al array
            if (Object.keys(filteredItem).length > 0) {
              filteredData.push(filteredItem);
            }
          });

          resolve(filteredData);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getDocsByUser = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Consultar la colección "car" para obtener los documentos que cumplan las condiciones
      const q = firestore()
        .collection("car")
        .where("createBy", "==", auth().currentUser.uid)
        .where("Index", "==", index);

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
      // Verificar si existe una versión en imagen
      const imageRef = storage().ref(
        `Documentos/${auth().currentUser.uid}/${titulo}_${index}_image`
      );
      const imageDownloadURL = await imageRef
        .getDownloadURL()
        .catch(() => null);

      // Si la versión en imagen existe, eliminarla
      if (imageDownloadURL) {
        await imageRef.delete();
        console.log("Versión en imagen existente eliminada.");
      }

      if (pdfBlobURL) {
        const reference = storage().ref(
          `Documentos/${auth().currentUser.uid}/${titulo}_${index}_pdf`
        );
        await reference.putFile(pdfBlobURL);

        const downloadURL = await reference.getDownloadURL();

        const q = firestore()
          .collection("car")
          .where("createBy", "==", auth().currentUser.uid)
          .where("Index", "==", index);

        const querySnapshot = await q.get();

        if (querySnapshot.empty) {
          console.log("No se encontró el documento en Firestore");
          return reject(
            new Error(
              "No se encontró el documento en Firestore desde la funcion uploadPDFToFirebase()"
            )
          );
        }

        const carDocRef = querySnapshot.docs[0].ref;
        const carDocSnapshot = await carDocRef.get();

        if (!carDocSnapshot.exists) {
          console.log("El documento no existe en Firestore");
          return reject(
            new Error(
              "El documento no existe en Firestore desde la funcion uploadPDFToFirebase()"
            )
          );
        }

        const carData = carDocSnapshot.data();
        const documentosData = carData.documentos || {};
        documentosData[titulo] = downloadURL;

        await carDocRef.update({
          documentos: documentosData,
        });

        console.log("Documento actualizado exitosamente.");
        resolve(downloadURL);
      } else {
        console.log("No PDF selected.");
        reject(new Error("No PDF selected."));
      }
    } catch (error) {
      console.log("Error al subir el archivo PDF a Firebase Storage: " + error);
      reject(error);
    }
  });
};

export const getURLFromFirestore = async (index, nameDoc) => {
  try {
    // Consultar la colección "car" para obtener el documento que cumpla las condiciones
    const q = firestore()
      .collection("car")
      .where("createBy", "==", auth().currentUser.uid)
      .where("Index", "==", index);

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      throw new Error("No se encontró el documento en Firestore");
    }

    const carDocRef = querySnapshot.docs[0].ref;
    const carDocSnapshot = await carDocRef.get();

    if (!carDocSnapshot.exists) {
      throw new Error("El documento no existe en Firestore");
    }

    // Obtener la URL del subcampo específico en el campo "documentos"
    const documentosData = carDocSnapshot.data().documentos;
    // Verificar si la palabra 'pdf' está en la URL
    const isPdf = documentosData[nameDoc].includes("pdf");
    if (documentosData && documentosData[nameDoc]) {
      return {
        url: documentosData[nameDoc],
        isPdf: isPdf,
      };
    } else {
      return {
        url: documentosData[nameDoc],
        isPdf: isPdf,
      }; // Si no se encuentra la URL
    }
  } catch (error) {
    throw new Error(
      "Error al obtener la URL desde Firestore: " + error.message
    );
  }
};

export const deleteCar = (index) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        reject(new Error("Usuario no autenticado"));
        return;
      }

      // Consultar la colección "car" para obtener el documento que cumpla las condiciones
      const q = firestore()
        .collection("car")
        .where("createBy", "==", currentUser.uid)
        .where("Index", "==", index);

      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        reject(new Error("No se encontró el documento en Firestore"));
        return;
      }

      const carDocRef = querySnapshot.docs[0].ref;

      // Obtener el nombre de la imagen
      const imageName = `${currentUser.uid}/${currentUser.uid}_${index}`;

      // Eliminar la imagen de Firebase Storage
      await storage().ref(`Avatar/${imageName}`).delete();

      // Eliminar el documento en Firestore
      await carDocRef.delete();

      resolve("El documento y la imagen fueron eliminados correctamente.");
    } catch (error) {
      reject(new Error("Error al eliminar el documento: " + error.message));
    }
  });
};

export const getLastIndexForUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const carCollection = firestore().collection("car");
      const querySnapshot = await carCollection
        .where("createBy", "==", auth().currentUser.uid)
        .orderBy("Index", "desc")
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
      console.error("Error al obtener el idAuto más alto:", error);
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
        .collection("car")
        .where("createBy", "==", userId)
        .orderBy("Index")
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
      console.error("Error fetching lowest index:", error);
      reject(error);
    }
  });
};

// Función para eliminar una carpeta completa en Firebase Storage
export const deleteFolder = async (folderPath) => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    throw new Error("Usuario no autenticado");
  }

  try {
    // Obtener una referencia a la carpeta
    const folderRef = storage().ref(folderPath);

    // Listar todos los objetos dentro de la carpeta
    const listResult = await folderRef.listAll();

    // Verificar si la carpeta está vacía
    if (listResult.items.length === 0) {
      console.log("La carpeta está vacía, no se necesita eliminar.");
      return; // Salir de la función si la carpeta está vacía
    }

    // Eliminar cada objeto dentro de la carpeta
    const deletionPromises = listResult.items.map(async (item) => {
      await item.delete();
    });

    // Esperar a que se completen todas las eliminaciones
    await Promise.all(deletionPromises);

    // Eliminar la carpeta en sí
    await folderRef.delete();
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.log("La carpeta ya ha sido eliminada.");
    } else {
      throw new Error("Error al eliminar la carpeta: " + error.message);
    }
  }
};

// Función para eliminar documentos en la colección 'car', carpeta 'Avatar' y carpeta 'Documentos'
export const deleteUserAccount = (
  userGoogle,
  setUserGoogle,
  setUser,
  navigation
) => {
  return new Promise(async (resolve, reject) => {
    const currentUser = auth().currentUser;

    if (!currentUser) {
      reject(new Error("Usuario no autenticado"));
      return;
    }

    try {
      // Eliminar documentos en la colección 'car' donde createBy == currentUser.uid
      const querySnapshot = await firestore()
        .collection("car")
        .where("createBy", "==", currentUser.uid)
        .get();

      if (!querySnapshot.empty) {
        // Eliminar todos los documentos encontrados
        const deletionPromises = querySnapshot.docs.map(async (doc) => {
          await doc.ref.delete();
        });

        await Promise.all(deletionPromises);
      }

      // Eliminar la carpeta 'Avatar/currentUser.uid' en la ruta 'Avatar/'
      await deleteFolder(`Avatar/${currentUser.uid}`);
      await deleteFolder(`Documentos/${currentUser.uid}`);

      // Cerrar la sesión del usuario
      //  await auth().signOut();

      // Eliminar la cuenta de usuario
      //  await currentUser.delete();

      if (userGoogle) {
        // Eliminar la cuenta de usuario

        await currentUser.delete();
        setUserGoogle();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } else {
        // Eliminar la cuenta de usuario
        await currentUser.delete();
        setUser(); //con esto vacio deberia cambiar a login ya que en App dice si hay User entonces cambia
        await auth().signOut();
      }

      resolve("Documentos y carpetas eliminados correctamente.");
    } catch (error) {
      reject(
        new Error(
          "Error al eliminar los documentos y carpetas: " + error.message
        )
      );
    }
  });
};

export const reauthenticate = (currentPassword) => {
  return new Promise((resolve, reject) => {
    const user = auth().currentUser;
    const credential = auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        // Reautenticación exitosa
        resolve("Reautenticación exitosa");
      })
      .catch((error) => {
        // Manejar errores de reautenticación
        reject(error);
      });
  });
};
