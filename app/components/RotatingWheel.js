import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

export default function RotatingWheel() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000, // Duración de la animación en milisegundos
        easing: Easing.linear,
        useNativeDriver: true, // Habilita el uso del controlador nativo para el rendimiento
      }).start(spin);
    };

    spin();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Rango de rotación en grados
  });

  return (
    <View
      style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
    >
      <Animated.Image
        source={require('../../assets/Iconos/RUEDA.png')} // Ruta de tu imagen de la rueda
        style={{
          width: 100,
          height: 100,
          transform: [{ rotate: spin }], // Aplicar la animación de rotación
        }}
      />
    </View>
  );
}
