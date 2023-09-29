import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { addDataToUser } from './Database/users';
import analytics from '@react-native-firebase/analytics';

GoogleSignin.configure({
  webClientId:
    '730964090293-j8qde5d3aqe9vv5r1i4d2q2dc0p22n3b.apps.googleusercontent.com',
});

export const onGoogleButtonPress = async (setHidden, toastRef, setLoading) => {
  setHidden(false); // Esto es para que al cancelar el inicio de sesión, el Loading desaparezca
  try {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    setLoading(true);
    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then(async (user) => {
        await addDataToUser();
        toastRef.current.show('Hola ' + user.user.displayName, 3000);
      })
      .catch(async (err) => {
        if (err.code === 'auth/user-disabled') {
          toastRef.current.show(
            'Esta cuenta ha sido deshabilitada temporalmente',
            3000
          );
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }
        setLoading(false);
      });

    // Registro de evento de inicio de sesión exitoso
    await analytics().logEvent('sesionGoogle', {
      id: 3745092,
      item: auth().currentUser.uid,
      description: ['round neck', 'long sleeved'],
      size: 'L',
    });
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      toastRef.current.show('Inicio de sesión cancelado', 2500);
      setHidden(true);

      // Registro de evento de inicio de sesión cancelado
      await analytics().logEvent('google_sign_in_cancelled');
    } else {
      // Registro de evento de error de inicio de sesión
      await analytics().logEvent('google_sign_in_error', {
        error_message: error.message,
      });
    }
  }
};

export const isDisabledAccount = async (setUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const user_sign_in = await auth().signInWithCredential(googleCredential);

      // Aquí puedes mostrar el mensaje de bienvenida si lo deseas
      // toastRef.current.show('Hola ' + user_sign_in.user.displayName, 3000);

      resolve('Hola ' + user_sign_in.user.displayName);
    } catch (error) {
      if (error.code === 'auth/user-disabled') {
        // La cuenta está deshabilitada temporalmente
        // toastRef.current.show('Esta cuenta ha sido deshabilitada temporalmente', 3000);

        await auth().signOut();
        // RevokeAccess y SignOut de Google
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        // Si el cierre de sesión en Firebase es exitoso, entonces se procede a cerrar la sesión en RevenueCat

        setUser();
        resolve('Esta cuenta ha sido deshabilitada temporalmente');
      } else {
        reject(error);
      }
    }
  });
};
