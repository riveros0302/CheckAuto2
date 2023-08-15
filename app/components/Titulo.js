import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function Titulo(props) {
  const { title } = props;
  return (
    <View>
      <Text style={styles.nombre}>{title}</Text>
      <View style={styles.linea} />
    </View>
  );
}

const styles = StyleSheet.create({
  nombre: {
    fontWeight: '900',
    fontSize: 28,
    color: 'white',
    alignSelf: 'center',
    marginTop: 60,
  },
  linea: {
    width: 250,
    height: 3,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginBottom: 30,
  },
});
