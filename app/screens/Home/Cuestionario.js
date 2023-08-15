import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import { Button, Icon, Image, Input } from 'react-native-elements';
import { primary, botoncolor } from '../../utils/tema';
import {
  pregunta,
  placeh,
  id,
  combustibleOptions,
} from '../../utils/preguntas';
import { insertAuto } from '../../utils/Database/auto';
import AvatarCar from '../../components/AvatarCar';
import { SelectList } from 'react-native-dropdown-select-list';

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
  } = props;
  const [startIndex, setStartIndex] = useState(0);
  const [title, setTitle] = useState(
    '¡Vamos a completar la información de tu vehiculo!'
  );
  const [enabled, setEnabled] = useState(true);
  const [isFoto, setIsFoto] = useState(false);
  const [values, setValues] = useState({});

  const next = () => {
    setVehiculo(values);

    // Inicializar campos en el objeto vehiculo con valor predeterminado
    const vehiculoConCamposVacios = {
      año: '',
      marca: '',
      modelo: '',
      url: '',
      patente: '',
      tipo: '',
      combustible: '',
      aire: '',
      rueda: '',
      luces: '',
      transmision: '',
      motor: '',
      autonomia: '',
      n_motor: '',
      n_chasis: '',
    };

    // Fusionar los valores ingresados por el usuario con los campos vacíos predeterminados
    const vehiculoFinal = { ...vehiculoConCamposVacios, ...values };

    if (isFoto) {
      //setData({});
      setVisible(false);
      insertAuto(vehiculoFinal);
    }
  };

  const setValue = (key, value) => {
    if (key === 'patente') {
      const alphanumericText = value.replace(/[^A-Za-z0-9]/g, '');

      // Separar la patente en grupos de 2 caracteres con un "-" en el medio
      const formattedText = alphanumericText.replace(/(.{2})(?=.)/g, '$1-');

      // Convertir el texto a mayúsculas
      const uppercaseText = formattedText.toUpperCase();

      setValues((prevValues) => ({
        ...prevValues,
        [key]: uppercaseText,
      }));
    } else {
      // Convertir el texto a mayúsculas
      const uppercaseText = value.toUpperCase();
      setValues((prevValues) => ({
        ...prevValues,
        [key]: uppercaseText,
      }));
    }
  };

  const getValue = (e, type) => {
    console.log(type);
    if (type === 'combustible') {
      setVehiculo({ ...vehiculo, [type]: e });
    } else {
      setVehiculo({ ...vehiculo, [type]: e.nativeEvent.text });
    }
  };

  const showMoreInputs = () => {
    setEnabled(false);
    setStartIndex((prevIndex) => prevIndex + 6);

    switch (startIndex) {
      case 6:
        setTitle('¡Ya casi terminamos!');
        break;
      case 12:
        setIsFoto(true);
        setTitle('¡Y por ultimo sube una foto de tu vehiculo!');
        break;

      default:
        break;
    }
  };

  const showPrevInputs = () => {
    setStartIndex((prevIndex) => prevIndex - 6);
    setTitle('¡Vamos a completar la información de tu vehiculo!');

    switch (startIndex) {
      case 6:
        setEnabled(true);
        break;
      case 18:
        setIsFoto(false);
        break;

      default:
        break;
    }
  };

  const renderInput = () => {
    const endIndex = Math.min(startIndex + 6, placeh.length);

    return placeh.slice(startIndex, endIndex).map((res, index) => {
      let keyboardType = 'default';
      if (res === 'Año') {
        keyboardType = 'numeric';
      }

      const realIndex = startIndex + index; // Calcular el índice real

      switch (res) {
        case 'Combustible':
          return (
            <View key={index} style={styles.pickerContainer}>
              <SelectList
                setSelected={(e) => {
                  setValue(id[realIndex], e); // Actualizar el valor seleccionado en el estado
                }}
                value={values[id[realIndex]]}
                data={combustibleOptions}
                search={false}
                placeholder={res}
                boxStyles={{
                  borderRadius: 40,
                  width: '94%',
                  alignSelf: 'center',
                  backgroundColor: '#d6d6d6',
                  borderWidth: 0,
                }}
                inputStyles={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: 'grey',
                }}
                dropdownStyles={{
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: '#d6d6d6',
                  borderWidth: 0,
                }}
              />
            </View>
          );

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
              maxLength={8}
            />
          );

        default:
          return (
            <Input
              key={index}
              placeholder={res}
              keyboardType={keyboardType}
              onChange={(e) => setValue(id[realIndex], e.nativeEvent.text)} // Actualizar el valor en el estado
              value={values[id[realIndex]] || ''} // Asignar el valor almacenado del input
              inputStyle={styles.input}
              inputContainerStyle={{
                borderBottomWidth: 0,
              }}
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
          onPress={isFoto ? next : showMoreInputs}
          icon={
            <Icon
              type='material-community'
              name={isFoto ? 'check' : 'chevron-double-right'}
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
      {isFoto ? (
        <View>
          <Text style={styles.title}>{title}</Text>
          <View style={{ alignItems: 'center' }}>
            <AvatarCar
              vehiculo={values}
              setVehiculo={setValues}
              profile={profile}
              setProfile={setProfile}
              isPrincipal={true}
            />
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    width: '80%',
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
});
