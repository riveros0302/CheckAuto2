import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export const addDate1ToUser = async (date1, indexCar) => {
  try {
    const key = `${indexCar}_date1`;

    const dataToUpdate = {};
    dataToUpdate[key] = date1 || null;

    await firestore().collection("users").doc(auth().currentUser.uid).set(
      dataToUpdate,

      { merge: true }
    );

    console.log(`Date1_${indexCar} agregadas al usuario exitosamente.`);
  } catch (error) {
    console.log(`Error al agregar fechas al usuario: ${error.message}`);
  }
};

export const addDate2ToUser = async (date2, indexCar) => {
  try {
    const key = `${indexCar}_date2`;

    const dataToUpdate = {};
    dataToUpdate[key] = date2 || null;

    const userDoc = await firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .get();

    const userDates = userDoc.data();

    await firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .set(
        {
          ...userDates,
          ...dataToUpdate,
        },
        { merge: true }
      );

    console.log(`Date2_${indexCar} agregadas al usuario exitosamente.`);
  } catch (error) {
    console.log(`Error al agregar fechas al usuario: ${error.message}`);
  }
};

export const getDatesFromUser = async (index) => {
  try {
    const snapshot = await firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .get();

    if (snapshot.exists) {
      const userData = snapshot.data();

      // Utiliza la clave dinámica basada en el índice
      const date1Key = `${index}_date1`;
      const date2Key = `${index}_date2`;

      // Obtiene las fechas según las claves
      const date1 = userData[date1Key] || null;
      const date2 = userData[date2Key] || null;

      return { date1, date2 };
    } else {
      console.log("No se encontraron datos para el usuario.");
      return { date1: null, date2: null };
    }
  } catch (error) {
    console.log("Error al obtener las fechas del usuario:", error.message);
    throw new Error("No se pudieron obtener las fechas del usuario.");
  }
};

export const addDataToUser = async (nombre) => {
  try {
    const data = {
      nombre: nombre == "" ? auth().currentUser.displayName : nombre,
    };
    // Obtén el ID del usuario actualmente autenticado
    const userId = auth().currentUser.uid;

    // Obtiene los datos actuales del usuario
    const userDoc = await firestore().collection("users").doc(userId).get();

    const existingData = userDoc.data();

    // Combina los datos actuales con los nuevos datos proporcionados
    const newData = { ...existingData, ...data };

    // Actualiza el documento del usuario con los datos combinados
    await firestore()
      .collection("users")
      .doc(userId)
      .set(newData, { merge: true });

    console.log("Datos agregados al usuario exitosamente.");
  } catch (error) {
    console.log("Error al agregar datos al usuario:", error.message);
  }
};

export const addFeedbackToUser = async (mensaje) => {
  try {
    const data = {
      email: auth().currentUser.email,
      mensaje: mensaje,
    };

    // Actualiza el documento del usuario con los datos combinados
    await firestore()
      .collection("feedback")
      .doc(auth().currentUser.uid)
      .set(data, { merge: true });

    console.log("Mensaje agregado al feedback exitosamente.");
  } catch (error) {
    console.log("Error al agregar mensaje:", error.message);
  }
};
