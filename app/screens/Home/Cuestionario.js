import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Button, Icon, Image, Input } from 'react-native-elements';
import { primary, secondary } from '../../utils/tema';
import {
  pregunta,
  placeh,
  id,
  combustibleOptions,
  tipoOptions,
  transmisionOptions,
} from '../../utils/preguntas';
import { isEmpty } from 'lodash';
import { insertAuto, getLastIndexForUser } from '../../utils/Database/auto';
import { filterAuto, uploadImage } from '../../utils/uploadPhoto';
import AvatarCuestionario from '../../components/AvatarCuestionario';
import { SelectList } from 'react-native-dropdown-select-list';
import Loading from '../../components/Loading';
import { descripciones } from '../../utils/Descripcion/descGeneral';

export default function Cuestionario(props) {
  const {
    visible,
    setVisible,
    vehiculo,
    setVehiculo,
    profile,
    setProfile,
    addCar,
    setAddCar,
    setData,
    index,
    isUpdate,
    isEditIndex,
    toastRef,
  } = props;
  const [startIndex, setStartIndex] = useState(0);
  const [title, setTitle] = useState(
    '¡VAMOS A COMPLETAR LA INFORMACIÓN DE TU VEHICULO!'
  );
  const [enabled, setEnabled] = useState(true);

  const [values, setValues] = useState({});
  const [localProfile, setLocalProfile] = useState('');
  const [hiddenIMG, setHiddenIMG] = useState(false);
  const [loadModal, setLoadModal] = useState(false);
  const [isFoto, setIsFoto] = useState(false); //este state estaba en cuestionario pero lo pasamos para aca para poder usarlo aqui y enviarlo a cuestionario
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [rindex, setRindex] = useState();

  useEffect(() => {
    if (localProfile != '') {
      setProfile(localProfile);
    }
  }, [localProfile]);

  useEffect(() => {
    const getValueVehiculo = () => {
      if (!isEmpty(vehiculo)) {
        setValues(vehiculo);
      }
    };

    getValueVehiculo();
  }, []);

  const next = async () => {
    setLoadModal(true);
    subirFotoLocal();

    setVehiculo(values);
    // Inicializar campos en el objeto vehiculo con valor predeterminado
    const vehiculoConCamposVacios = {
      Propietario: '',
      Rut: '',
      Direccion: '',
      Año: '',
      Color: '',
      Marca: '',
      Modelo: '',
      url: '',
      Patente: '',
      Tipo: '',
      Combustible: '',
      Aceite: '',
      Aire: '',
      Rueda: '',
      Luces: '',
      Transmision: '',
      Motor: '',
      Rendimiento: '',
      N_motor: '',
      N_chasis: '',
    };

    // Fusionar los valores ingresados por el usuario con los campos vacíos predeterminados
    const vehiculoFinal = { ...vehiculoConCamposVacios, ...values };

    if (isFoto || hiddenIMG) {
      //setData({});
      if (isEditIndex) {
        await insertAuto(vehiculoFinal, isUpdate, index);
        setAddCar(false);
        setVisible(false);
        setLoadModal(false);
      } else {
        const lastindex = await getLastIndexForUser();
        const indexfinal =
          lastindex == null ? 0 : isUpdate ? lastindex : lastindex + 1;

        await insertAuto(vehiculoFinal, isUpdate, indexfinal);

        setAddCar(false);
        setVisible(false);
        setLoadModal(false);
      }
      toastRef.current.show('Vehiculo registrado correctamente', 3000);
    }
  };

  const subirFotoLocal = async () => {
    if (!isUpdate) {
      try {
        getLastIndexForUser().then(async (lastIndex) => {
          if (lastIndex === null) {
            const uploadUrl = await uploadImage(localProfile, index);
            getUrl('url', uploadUrl);
            filterAuto(uploadUrl, index);
          } else {
            const uploadUrl = await uploadImage(
              localProfile,
              isUpdate ? lastIndex : lastIndex + 1
            );
            getUrl('url', uploadUrl);
            filterAuto(uploadUrl, lastIndex + 1);
          }
        });
      } catch (error) {
        console.log('NO SE PUO NA SUBIR ' + error);
      }
    }
  };

  const getUrl = async (type, url) => {
    await setVehiculo({ ...vehiculo, [type]: url });
  };

  const formatRut = (rut) => {
    // Limpiar el RUT de cualquier caracter no numérico y mantener solo el dígito verificador
    const cleanedRut = rut.replace(/[^\dKk]/g, '');

    if (cleanedRut.length <= 1) {
      return cleanedRut; // RUT sin cambios si tiene 1 o menos caracteres
    }

    // Obtener la parte numérica y el dígito verificador
    const rutNumbers = cleanedRut.slice(0, -1);
    const rutDV = cleanedRut.slice(-1).toUpperCase();

    // Dar formato con puntos y guión
    const formattedRut =
      rutNumbers.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') +
      (rutDV === 'K' ? '-K' : `-${rutDV}`);

    // Truncar cualquier caracter adicional después del dígito verificador
    const truncatedRut = formattedRut.slice(0, 12); // Longitud máxima para un RUT

    return truncatedRut;
  };

  const setValue = (key, value) => {
    if (key === 'Patente') {
      const alphanumericText = value.replace(/[^A-Za-z0-9]/g, '');

      // Separar la patente en grupos de 2 caracteres con un "-" en el medio
      const formattedText = alphanumericText.replace(/(.{2})(?=.)/g, '$1-');

      // Convertir el texto a mayúsculas
      const uppercaseText = formattedText.toUpperCase();

      setValues((prevValues) => ({
        ...prevValues,
        [key]: formattedText,
      }));
    } else if (key === 'Rut') {
      // Dar formato al RUT
      const formattedRut = formatRut(value);

      setValues((prevValues) => ({
        ...prevValues,
        [key]: formattedRut,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [key]: value,
      }));
    }
  };

  const showMoreInputs = () => {
    setEnabled(false);
    setStartIndex((prevIndex) => prevIndex + 6);

    switch (startIndex) {
      case 12:
        setTitle('¡YA CASI TERMINAMOS!');
        setHiddenIMG(isUpdate ? true : false);
        break;
      case 18:
        setIsFoto(true);
        setTitle('¡Y POR ULTIMO SUBE UNA FOTO DE TU VEHICULO!');
        break;

      default:
        break;
    }
  };

  const showPrevInputs = () => {
    console.log(startIndex);
    setStartIndex((prevIndex) => prevIndex - 6);
    switch (startIndex) {
      case 6:
        setEnabled(true);
        break;
      case 12:
        setTitle('¡VAMOS A COMPLETAR LA INFORMACIÓN DE TU VEHICULO!');
        //setEnabled(true);
        break;
      case 18:
        setTitle('¡VAMOS A COMPLETAR LA INFORMACIÓN DE TU VEHICULO!');

        setHiddenIMG(false);
        break;
      case 24:
        setTitle('¡YA CASI TERMINAMOS!');
        setIsFoto(false);
        break;

      default:
        break;
    }
  };

  const selectView = (option, realIndex, res, index) => {
    return (
      <View key={index} style={styles.pickerContainer}>
        <View style={styles.selectContainer}>
          <SelectList
            setSelected={(e) => {
              setValue(id[realIndex], e);
            }}
            value={values[id[realIndex]]}
            data={option}
            search={false}
            placeholder={values[id[realIndex]] ? values[id[realIndex]] : res}
            boxStyles={styles.selectBox}
            inputStyles={styles.selectInput}
            dropdownStyles={styles.dropDownInput}
          />
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name='information-outline'
            type='material-community'
            color={primary}
            disabledStyle={styles.block}
            size={35}
            onPress={() => {
              setShowModalInfo(true);
              setRindex(realIndex);
            }}
          />
        </View>
      </View>
    );
  };

  const renderInput = () => {
    const endIndex = Math.min(startIndex + 6, placeh.length);

    return placeh.slice(startIndex, endIndex).map((res, index) => {
      let keyboardType = 'default';
      let maxLength = 0;

      if (res === 'Año') {
        keyboardType = 'numeric';
        maxLength = 4;
      }

      const realIndex = startIndex + index; // Calcular el índice real
      switch (res) {
        case 'Combustible':
          return selectView(combustibleOptions, realIndex, res, index);

        case 'Tipo de Vehiculo':
          return selectView(tipoOptions, realIndex, res, index);
        case 'Transmisión':
          return selectView(transmisionOptions, realIndex, res, index);
        case 'Placa Patente':
          return (
            <Input
              key={index}
              placeholder={res}
              keyboardType={keyboardType}
              onChangeText={(e) => setValue(id[realIndex], e)} // Actualizar el valor en el estado
              value={values[id[realIndex]] || ''} // Asignar el valor almacenado del input
              inputStyle={styles.input}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
              onBlur={() => {
                // Convertir el texto a mayúsculas al salir del campo
                const uppercaseText = (
                  values[id[realIndex]] || ''
                ).toUpperCase();
                setValue(id[realIndex], uppercaseText);
              }}
              maxLength={8}
              rightIcon={
                <Icon
                  name='information-outline'
                  type='material-community'
                  color={descripciones[id[realIndex]] ? primary : secondary}
                  disabledStyle={styles.block}
                  disabled={descripciones[id[realIndex]] ? false : true}
                  size={35}
                  onPress={() => {
                    setShowModalInfo(true);
                    setRindex(realIndex);
                  }}
                />
              }
            />
          );

        default:
          return (
            <Input
              key={index}
              placeholder={res}
              maxLength={maxLength === 0 ? null : maxLength}
              keyboardType={keyboardType}
              onChange={(e) => setValue(id[realIndex], e.nativeEvent.text)} // Actualizar el valor en el estado
              value={values[id[realIndex]] || ''} // Asignar el valor almacenado del input
              inputStyle={styles.input}
              onBlur={() => {
                // Convertir el texto a mayúsculas al salir del campo
                const uppercaseText = (
                  values[id[realIndex]] || ''
                ).toUpperCase();
                setValue(id[realIndex], uppercaseText);
              }}
              inputContainerStyle={{
                borderBottomWidth: 0, // Para eliminar la línea inferior del campo de entrada
                flexDirection: 'row', // Para alinear el icono a la derecha
                alignItems: 'center', // Para centrar verticalmente el icono
                paddingRight: descripciones[id[realIndex]] ? 0 : 35,
              }}
              rightIcon={
                descripciones[id[realIndex]] && (
                  <Icon
                    name='information-outline'
                    type='material-community'
                    color={primary}
                    size={35}
                    disabledStyle={styles.block}
                    onPress={() => {
                      setShowModalInfo(true);
                      setRindex(realIndex);
                    }}
                  />
                )
              }
            />
          );
      }
    });
  };

  const hiddenBack = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {!enabled ? (
          <Button
            buttonStyle={styles.botonback}
            onPress={showPrevInputs}
            icon={
              <Icon
                type='material-community'
                name='chevron-double-left'
                color={'white'}
                size={50}
              />
            }
          />
        ) : (
          <View />
        )}

        <Button
          buttonStyle={styles.boton}
          disabled={
            isFoto || hiddenIMG
              ? !isEmpty(vehiculo.url_foto) || !isEmpty(localProfile)
                ? false
                : true
              : false
          }
          onPress={isFoto || hiddenIMG ? next : showMoreInputs}
          icon={
            <Icon
              type='material-community'
              name={isFoto || hiddenIMG ? 'check' : 'chevron-double-right'}
              color={'white'}
              size={50}
            />
          }
        />
      </View>
    );
  };

  return (
    <Modal
      isVisible={visible}
      setIsVisible={setVisible}
      colorModal={'white'}
      close={addCar}
      setAddCar={setAddCar}
    >
      <View>
        {isFoto ? (
          <View>
            <Text style={styles.title}>{title}</Text>
            <View style={{ alignItems: 'center' }}>
              <AvatarCuestionario
                vehiculo={values}
                setVehiculo={setValues}
                profile={!isEmpty(vehiculo) ? vehiculo.url_foto : localProfile}
                setProfile={setLocalProfile}
                isPrincipal={true}
                index={index}
              />
              <Loading isVisible={loadModal} text='Subiendo Imagen...' />
            </View>

            {hiddenBack()}
          </View>
        ) : (
          <View>
            <Text style={styles.title}>{title}</Text>
            {renderInput()}
            {hiddenBack()}
          </View>
        )}
        <ModalInfo
          setShowModalInfo={setShowModalInfo}
          showModalInfo={showModalInfo}
          descripciones={descripciones}
          id={id}
          realIndex={rindex}
        />
      </View>
    </Modal>
  );
}

function ModalInfo(props) {
  const { descripciones, showModalInfo, setShowModalInfo, id, realIndex } =
    props;

  const handleLinkPress = (url) => {
    Linking.openURL(url); // Abre la URL en el navegador
  };

  const renderDescription = () => {
    const description = descripciones[id[realIndex]];

    if (!description) {
      return null; // Si la descripción está undefined, no renderizamos nada
    }
    const descriptionParts = description.split(' ');

    return descriptionParts.map((part, index) => {
      if (part.startsWith('http') || part.startsWith('www')) {
        // Si la parte comienza con http o www, es probable que sea una URL
        return (
          <Text
            key={index}
            style={{ color: primary, textDecorationLine: 'underline' }}
            onPress={() => handleLinkPress(part)}
          >
            {part}{' '}
          </Text>
        );
      } else {
        return <Text key={index}>{part} </Text>;
      }
    });
  };

  return (
    <Modal
      isVisible={showModalInfo}
      setIsVisible={setShowModalInfo}
      colorModal={'white'}
      close={false}
    >
      <Text style={styles.titleInfo}>¿COMO LO OBTENGO?</Text>
      <ScrollView style={{ height: '80%' }}>
        <Text style={styles.descInfo}>{renderDescription()}</Text>
      </ScrollView>

      <Button
        title={'ENTENDIDO'}
        onPress={() => setShowModalInfo(false)}
        buttonStyle={styles.btnInfo}
        titleStyle={styles.txtbtnInfo}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primary,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  boton: {
    marginTop: 30,
    backgroundColor: '#00c400',
    borderRadius: 50,
  },
  btnimage: {
    width: 100,
    alignSelf: 'center',
    backgroundColor: 'grey',
  },
  imagen: {
    width: 300,
    height: 300,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 300,
  },
  input: {
    backgroundColor: '#d6d6d6',
    borderRadius: 30,
    paddingLeft: 15,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  botonback: {
    marginTop: 30,
    backgroundColor: '#d6d6d6',
    borderRadius: 50,
  },
  selectBox: {
    borderRadius: 40,
    width: '94%',
    alignSelf: 'center',
    backgroundColor: '#d6d6d6',
    borderWidth: 0,
    marginBottom: 25,
  },
  selectInput: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'grey',
  },
  dropDownInput: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#d6d6d6',
    borderWidth: 0,
    marginBottom: 10,
    marginTop: -20,
  },
  pickerContainer: {
    flexDirection: 'row',
  },
  selectContainer: {
    flex: 1, // El 'SelectList' ocupará la mayor parte del espacio disponible
  },
  iconContainer: {
    marginLeft: -8,
    marginRight: 10,
    marginTop: 5,
  },
  titleInfo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: primary,
    marginBottom: 15,
  },
  descInfo: {
    color: 'grey',
    width: '85%',
    marginLeft: 20,
    marginBottom: 15,
    fontSize: 15,
    textAlign: 'left',
  },
  btnInfo: {
    backgroundColor: 'transparent',
    width: '50%',
    alignSelf: 'flex-end',
  },
  txtbtnInfo: {
    color: primary,
  },
  block: {
    backgroundColor: 'transparent',
  },
});
