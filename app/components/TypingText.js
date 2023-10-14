import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colorTexto } from '../utils/tema';
import { Button } from 'react-native-elements';
import BotonAnimado from './BotonAnimado';

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

  useEffect(() => {
    setIsCompleted(false);
    setDisplayedText('');
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
        setIsCompleted(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <View>
      <Text style={styles.txt}>{displayedText}</Text>
      {isCompleted && (
        <View style={isOmitir && styles.omitir}>
          {isOmitir && (
            <BotonAnimado
              setIndexIntro={setIndexIntro}
              indexIntro={indexIntro}
              setIsOmitir={setIsOmitir}
              omitir={true}
              setTuto={setTuto}
            />
          )}
          <BotonAnimado
            setIndexIntro={setIndexIntro}
            indexIntro={indexIntro}
            setIsOmitir={setIsOmitir}
            omitir={false}
            setTuto={setTuto}
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
