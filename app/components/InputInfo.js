import { StyleSheet, Text, View, Alert, Keyboard } from 'react-native';
import { Input, Icon } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { primary } from '../utils/tema';

export default function InputInfo(props) {
  const {
    descripcion,
    placeholder,
    label,
    iconinfo,
    keyboard,
    valuetxt,
    setValuetxt,
  } = props;
  const [tipokey, setTipokey] = useState('default');
  const [maxlenght, setMaxlenght] = useState(20);

  useEffect(() => {
    if (keyboard === 'numeric') {
      setTipokey(keyboard);
      setMaxlenght(4);
    }
  }, []);

  const info = () => {
    Alert.alert(
      `¿Como lo obtengo?`,
      `${descripcion}`,
      [{ text: 'Entendido', style: 'cancel' }],
      { cancelable: false }
    );
  };

  const getValue = (text) => {
    const uppercaseText = text.toUpperCase();
    // Validar si el texto es nulo o indefinido, en ese caso establecer una cadena vacía
    setValuetxt(uppercaseText || '');
  };

  return (
    <View style={styles.general}>
      <Input
        placeholder={placeholder}
        label={label}
        onChangeText={getValue}
        value={valuetxt ? valuetxt : ''}
        keyboardType={tipokey}
        labelStyle={styles.label}
        maxLength={maxlenght}
        rightIcon={
          iconinfo ? (
            <Icon
              name={'information-outline'}
              type='material-community'
              color={primary}
              size={30}
              onPress={info}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  general: {
    margin: 10,
    zIndex: 1,
  },
  label: {
    fontSize: 15,
    color: primary,
  },
});
