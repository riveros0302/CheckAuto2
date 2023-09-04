import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '730964090293-j8qde5d3aqe9vv5r1i4d2q2dc0p22n3b.apps.googleusercontent.com',
});

export const onGoogleButtonPress = async (setHidden, toastRef, setLoading) => {
  setHidden(false); //esto es para que al cancelar el login, el Loading desaparesca
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
    // return auth().signInWithCredential(googleCredential);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then((user) => {
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
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      toastRef.current.show('Inicio de sesión cancelado', 2500);
      setHidden(true);
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
