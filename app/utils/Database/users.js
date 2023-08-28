import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Función para guardar información de suscripción en Firestore
export const saveSubscriptionInfo = async (subscriptionInfo) => {
  try {
    await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .set(subscriptionInfo, { merge: true });
  } catch (error) {
    console.log('Error saving subscription info:', error.message);
  }
};

// Función para obtener información de suscripción desde Firestore
export const getSubscriptionInfo = async () => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(auth().currentUser.uid)
      .get();
    return snapshot.data();
  } catch (error) {
    console.log('Error getting subscription info:', error.message);
    return null;
  }
};
