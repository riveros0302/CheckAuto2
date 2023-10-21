import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { colorTexto } from '../utils/tema';
import { Button } from 'react-native-elements';
import BotonAnimado from './BotonAnimado';
import * as Animatable from 'react-native-animatable';

export default function TypingText({
  text,
  speed,
  setIndexIntro,
  indexIntro,
  setTuto,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOmitir, setIsOmitir] = useState(false);
  const animatableTextRef = useRef(null);

  useEffect(() => {
    setIsCompleted(true);
  }, [text, speed]);

  const restartAnimation = () => {
    // Restart the 'bounceIn' animation
    animatableTextRef.current.bounceIn();
  };

  return (
    <View>
      <Animatable.Text
        ref={animatableTextRef}
        animation='bounceIn'
        duration={900}
        style={styles.txt}
      >
        {text}
      </Animatable.Text>
      {isCompleted && (
        <View style={isOmitir && styles.omitir}>
          {isOmitir && (
            <BotonAnimado
              setIndexIntro={setIndexIntro}
              indexIntro={indexIntro}
              setIsOmitir={setIsOmitir}
              omitir={true}
              setTuto={setTuto}
              restartAnimation={restartAnimation}
            />
          )}
          <BotonAnimado
            setIndexIntro={setIndexIntro}
            indexIntro={indexIntro}
            setIsOmitir={setIsOmitir}
            omitir={false}
            setTuto={setTuto}
            restartAnimation={restartAnimation}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  txt: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    top: 20,
    color: colorTexto,
    width: '90%',
    alignSelf: 'center',
  },
  omitir: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 25,
  },
});
