import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { Icon, Image } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import Pdf from 'react-native-pdf';
import * as DocumentPicker from 'expo-document-picker';
import { primary } from '../../utils/tema';
import * as SQLite from 'expo-sqlite';

// Abrir la base de datos (o crearla si no existe)
const db = SQLite.openDatabase('database.db');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function AddDocument(props) {
  const { route, navigation } = props;
  const { tabla, title } = route.params;
  const [pdfurl, setPdfurl] = useState(null);
  const [reload, setReload] = useState(false);
  const [nameicon, setNameicon] = useState('upload');

  useEffect(() => {
    navigation.setOptions({ title: title });
  }, [navigation]);

  useEffect(() => {
    //preguntar si existen datos en las tablas
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tabla} WHERE EXISTS (SELECT 1 FROM ${tabla})`,
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            if (isEmpty(pdfurl)) {
              setPdfurl({
                uri: rows._array[0].url,
                cache: true,
              });
              setNameicon('reload');
            }
          } else {
            setPdfurl(null);
            setNameicon('upload');
          }
        }
      );
    });
  }, [reload]);

  useEffect(() => {
    // Ejecutar una consulta SQL
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS ${tabla} (id INTEGER PRIMARY KEY, name TEXT, url TEXT)`
      );
    });
  }, []);

  const cleanTable = () => {
    db.transaction((tx) => {
      tx.executeSql(`DELETE FROM ${tabla}`, [], (_, { rowsAffected }) => {
        console.log(
          `Se eliminaron ${rowsAffected} elementos de la tabla documentos`
        );
        setReload(true);
      });
    });
  };

  const deleteTable = () => {
    db.transaction((tx) => {
      tx.executeSql(`DROP TABLE IF EXISTS ${tabla}`, [], () => {
        console.log(`Tabla ${tabla} eliminada`);
      });
    });
  };

  const botondelete = () => {
    Alert.alert(
      `Eliminar ${title}`,
      `¿Deseas eliminar el ${title}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => cleanTable(),
        },
      ],
      { cancelable: false }
    );
  };

  async function pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      if (result.type === 'success') {
        //limpiar tabla para que no haya otro PDF
        cleanTable();
        setPdfurl({
          uri: result.uri,
          cache: true,
        });
        setNameicon('reload');
        //agegar url del pdf a sqlite
        db.transaction((tx) => {
          tx.executeSql(
            `INSERT INTO ${tabla} (name, url) VALUES (?, ?)`,
            [result.name, result.uri],
            (_, { rowsAffected }) => {
              if (rowsAffected > 0) {
                console.log(`PDF ${result.name} agregado`);
              }
            }
          );
        });
      } else {
        console.log('se cancelo la seleccion');
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: pdfurl ? primary : 'grey',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 32,
      }}
    >
      {pdfurl ? (
        <Pdf
          trustAllCerts={false}
          source={pdfurl}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={{ flex: 1, alignSelf: 'stretch' }}
        />
      ) : (
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png',
          }}
          style={styles.nopdf}
        />
      )}
      <SafeAreaView
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {pdfurl && (
          <Icon
            name={'delete'}
            type='material-community'
            color={'red'}
            size={40}
            onPress={botondelete}
            containerStyle={{ backgroundColor: 'red', width: '50%' }}
          />
        )}

        <Icon
          name={nameicon}
          type='material-community'
          color={'red'}
          size={40}
          onPress={pickDocument}
          containerStyle={styles.iconst}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nopdf: {
    width: screenWidth / 1.5,
    height: screenHeight / 2.4,
    margin: 30,
  },
  iconst: {
    width: '50%',
  },
});
