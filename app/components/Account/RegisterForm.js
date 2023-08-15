import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import Loading from '../Loading';
import { validateEmail } from '../../utils/validations';
import { size, isEmpty } from 'lodash';
import { primary } from '../../utils/tema';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

export default function RegisterForm() {
  //const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onSubmit = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      //  toastRef.current.show('Todos los campos son obligatorios');
      console.log('todos los campos son obligatirios');
    } else if (!validateEmail(formData.email)) {
      //  toastRef.current.show('El email no es correcto');
      console.log('mail incorrecto');
    } else if (formData.password !== formData.repeatPassword) {
      // toastRef.current.show('Las contraseñas tienen que ser iguales');
      console.log('password diferentes');
    } else if (size(formData.password) < 6) {
      // toastRef.current.show( 'La contraseña tiene que tener al menos 6 caracteres');
      console.log('password menor a 6');
    } else {
      setLoading(true);

      auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(async () => {
          /* await db.collection('user').add({
            name: formData.name,
            direccion: formData.direccion,
            email: formData.email,
            fono: formData.fono,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
            calle: '',
            id_comuna: 0,
            //el await de arriba lo hacemos para que espere ya que se le esta igresando el createby y como se esta creando aun, no puede obtenerlo
          });*/
          setLoading(false);
          navigation.navigate('login');
        })
        .catch(() => {
          setLoading(false);
          // toastRef.current.show('El email ya esta en uso, pruebe con otro');
          console.log('mail en uso');
        });
    }
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder='Correo electronico'
        keyboardType='email-address'
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'email')}
        rightIcon={
          <Icon
            type='material-community'
            name='at'
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder='Contraseña'
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={showPassword ? false : true}
        onChange={(e) => onChange(e, 'password')}
        rightIcon={
          <Icon
            type='material-community'
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder='Repetir contraseña'
        containerStyle={styles.inputForm}
        password={true}
        secureTextEntry={showRepeatPassword ? false : true}
        onChange={(e) => onChange(e, 'repeatPassword')}
        rightIcon={
          <Icon
            type='material-community'
            name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
          />
        }
      />
      <Button
        title='Unirse'
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text='Creando cuenta' />
    </View>
  );
}

function defaultFormValue() {
  return {
    email: '',
    password: '',
    repeatPassword: '',
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputForm: {
    width: '100%',
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: '95%',
  },
  btnRegister: {
    backgroundColor: primary,
  },
  iconRight: {
    color: '#c1c1c1',
  },
});
