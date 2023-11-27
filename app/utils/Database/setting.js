import firestore from '@react-native-firebase/firestore';

export const getHoursFromFirestore = async () => {
  try {
    const docRef = await firestore()
      .collection('setting')
      .doc('i9IpCZ8jhZ5Hya35pD0l')
      .get();

    if (docRef.exists) {
      const versionInfo = docRef.data();
      if (
        versionInfo &&
        versionInfo.horaPC &&
        versionInfo.horaRT &&
        versionInfo.minutePC &&
        versionInfo.minuteRT
      ) {
        // Si existen los campos date1 y date2 en el documento
        const horaPC = versionInfo.horaPC;
        const minutePC = versionInfo.minutePC;
        const horaRT = versionInfo.horaRT;
        const minuteRT = versionInfo.minuteRT;

        return { horaPC, minutePC, horaRT, minuteRT };
      } else {
        console.log(
          'Los campos horaPC y horaRT no están presentes en el documento.'
        );
        return null;
      }
    } else {
      console.log('No se encontró el documento en la colección.');
      return null;
    }
  } catch (error) {
    console.log(
      'Error al obtener la información de las fechas:',
      error.message
    );
    return null;
  }
};
