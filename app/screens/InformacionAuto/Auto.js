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
import Boton from '../../components/Boton';
import MenuFlotante from '../../components/MenuFlotante';
import Titulo from '../../components/Titulo';
import { searchFirebase } from '../../utils/Database/auto';
import { solicitarCalificacion } from '../../components/ReviewGooglePlay';
import { Interstitial, interstitial } from '../../components/Ads/Interstitial';

export default function Auto({ route, blockAds }) {
  const { data, index } = route.params;
  const [datos, setDatos] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState([]);
  const keysToFilter = [
    'url_foto',
    'createBy',
    'Index',
    'device',
    'Propietario',
    'Rut',
    'Direccion',
  ];
  const orderKeys = [
    'Marca',
    'Modelo',
    'Año',
    'Color',
    'Patente',
    'Tipo',
    'Combustible',
    'Aceite',
    'Aire',
    'Rueda',
    'Luces',
    'Transmision',
    'Motor',
    'Rendimiento',
    'Numero_Motor',
    'Numero_Chasis',
  ];

  useEffect(() => {
    solicitarCalificacion();
    //excluimos los datos de kysToFilter
    const result = Object.entries(data)
      .filter(([key]) => !keysToFilter.includes(key))
      .map(([key, value]) => ({ [key]: value }));

    const ordenData = orderKeys.map((key) =>
      result.find((item) => Object.keys(item)[0] === key)
    );

    setDatos(ordenData);
  }, []);

  const updateData = (newData) => {
    const ordenData = orderKeys.map((key) =>
      newData.find((item) => Object.keys(item)[0] === key)
    );
    setDatos(ordenData);
  };

  useEffect(() => {
    searchFirebase(searchText, index).then((result) => {
      if (result.length > 0) {
        setFilter(result);
      } else {
        // No se encontraron resultados
        // console.log('No se encontraron resultados');
      }
    });

    if (searchText == '') {
      setFilter([]);
    }
  }, [searchText]);

  return (
    <View>
      <ImageBackground source={background} style={styles.image}>
        <Interstitial />
        <Titulo title='GENERAL' />

        <FlatList
          data={searchText ? filter : datos}
          renderItem={(item) => (
            <RenderItem item={item} indexx={index} updateData={updateData} />
          )}
          numColumns={2}
          keyExtractor={(item, index) =>
            index.toString() + JSON.stringify(item)
          }
        />
        <MenuFlotante
          datos={datos}
          isPDF={false}
          data={data}
          interstitial={interstitial}
          blockAds={blockAds}
        />
        <SearchBar
          placeholder='Buscar...'
          lightTheme
          round
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          autoCorrect={false}
        />
      </ImageBackground>
    </View>
  );
}

function RenderItem(props) {
  const { item, indexx, updateData } = props;
  const keys = Object.keys(item.item); // Obtener las claves de item.item
  const values = Object.values(item.item);

  const getIconByValue = {
    Marca: require('../../../assets/Iconos/MENU1.png'),
    Modelo: require('../../../assets/Iconos/MODELO.png'),
    Año: require('../../../assets/Iconos/AÑO.png'),
    Color: require('../../../assets/Iconos/COLOR.png'),
    Patente: require('../../../assets/Iconos/PATENTE.png'),
    Tipo: require('../../../assets/Iconos/TIPO.png'),
    Combustible: require('../../../assets/Iconos/GASOLINA.png'),
    Aceite: require('../../../assets/Iconos/TIPO_ACEITE.png'),
    Aire: require('../../../assets/Iconos/PRESION.png'),
    Rueda: require('../../../assets/Iconos/RUEDA.png'),
    Luces: require('../../../assets/Iconos/LUCES.png'),
    Transmision: require('../../../assets/Iconos/TRANSMISION.png'),
    Motor: require('../../../assets/Iconos/CILINDRADA.png'),
    Rendimiento: require('../../../assets/Iconos/CONSUMO.png'),
    Numero_Motor: require('../../../assets/Iconos/NMOTOR.png'),
    Numero_Chasis: require('../../../assets/Iconos/NCHASIS.png'),
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
          value={values[index]}
          index={indexx}
          updateData={updateData}
          isDocument={false}
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
