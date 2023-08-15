import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
} from 'react-native';
import { SearchBar } from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import { background } from '../../utils/tema';
import { getDocsByUser } from '../../utils/Database/auto';
import MenuFlotante from '../../components/MenuFlotante';
import Titulo from '../../components/Titulo';
import Boton from '../../components/Boton';
import Loading from '../../components/Loading';

export default function Identification(props) {
  const { route } = props;
  const { index } = route.params;
  const [datos, setDatos] = useState([]);
  const keysToFilter = ['url_foto', 'createBy', 'Index'];
  const orderKeys = ['Marca', 'Modelo', 'Año'];
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setReload(true);
    getDocsByUser(index).then((documents) => {
      console.log('documento: ' + JSON.stringify(documents));
      setDatos(documents);
      setReload(false);
    });
  }, []);

  return (
    <View>
      <ImageBackground source={background} style={styles.image}>
        <Titulo title='MIS DOCUMENTOS' />

        <FlatList
          data={datos}
          renderItem={(item) => <RenderItem item={item} indexx={index} />}
          numColumns={2}
          keyExtractor={(item, index) =>
            index.toString() + JSON.stringify(item)
          }
        />

        <MenuFlotante datos={datos} />
        <Loading isVisible={reload} text='Cargando...' />
      </ImageBackground>
    </View>
  );
}

function RenderItem(props) {
  const { item, indexx } = props;
  const keys = Object.keys(item.item); // Obtener las claves de item.item
  const values = Object.values(item.item);

  const getIconByValue = {
    inscripcion: require('../../../assets/Iconos/INSCRIPCION.png'),
    licencia_Conducir: require('../../../assets/Iconos/LICENCIA.png'),
    otros: require('../../../assets/Iconos/OTROS.png'),
    padron: require('../../../assets/Iconos/PADRÓN.png'),
    permiso_Circulacion: require('../../../assets/Iconos/CIRCULACION.png'),
    revision_Tecnica: require('../../../assets/Iconos/REVISION_TEC.png'),
    soap: require('../../../assets/Iconos/SOAP.png'),
  };

  function getIconPath(key) {
    return getIconByValue[key];
  }

  return (
    <View>
      {keys.map((key, index) => (
        <Boton
          key={index}
          icono={getIconPath(key)}
          titulo={key}
          isDocument={true}
          index={indexx}
          item={'pdf'}
          isCheck={values == '' ? false : true}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    height: '100%',
  },
  container: {
    flexDirection: 'row',
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  inputContainerStyle: {
    backgroundColor: '#e9e9e9',
  },
  inputStyle: {
    color: 'black',
  },
});
