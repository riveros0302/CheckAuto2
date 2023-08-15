import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'react-native-elements';
import React from 'react';
import Boton from '../../components/Boton';
import { secondary } from '../../utils/tema';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Document() {
  return (
    <View style={styles.vertical}>
      <View style={styles.viewperfil}>
        <Image
          source={{
            uri: 'https://www.sernac.cl/portal/619/articles-62977_imagen_01.thumb_i_normal.jpg',
          }}
          style={styles.imgcar}
        />
        <View style={styles.perfilhzt}>
          <Text style={styles.subtitle}>Jeep </Text>
          <Text style={styles.subtitle}>Grand cherokee</Text>
        </View>

        <Text style={styles.subtitle}>Año: 2015</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  vertical: {
    flexDirection: 'column',
    marginTop: '15%',
    backgroundColor: secondary,
    height: screenHeight,
  },
  viewperfil: {
    alignItems: 'center',
    marginBottom: 15,
  },
  nombre: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'grey',
  },
  perfilhzt: {
    flexDirection: 'row',
  },
  subtitle: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 20,
  },
  imgcar: {
    width: screenWidth,
    height: screenHeight / 5,
  },
});
