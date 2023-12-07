import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Text,
  ScrollView,
  Linking,
} from "react-native";
import { Button, Icon, Image } from "react-native-elements";
import React, { useState, useEffect, useRef } from "react";
import Pdf from "react-native-pdf";
import * as DocumentPicker from "expo-document-picker";
import { primary, background } from "../utils/tema";
import {
  uploadPDFToFirebase,
  getURLFromFirestore,
} from "../utils/Database/auto";
import { uploadImageDocument } from "../utils/uploadPhoto";
import Loading from "./Loading";
import MenuFlotante from "./MenuFlotante";
import { descripciones } from "../utils/Descripcion/descDocument";
import { idDoc } from "../utils/preguntas";
import Modal from "./Modal";
import * as ImagePicker from "expo-image-picker";
import ImageResizer from "react-native-image-resizer";
import { useNavigation } from "@react-navigation/native";
import ScannerQr from "./ScannerQr";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function ShowPDF({ route, toastRef }) {
  const { index, titulo } = route.params;
  const [pdfurl, setPdfurl] = useState(null);
  const [reload, setReload] = useState(false);
  const [txtLoad, setTxtLoad] = useState("Cargando documento...");
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const navigation = useNavigation();

  console.log(titulo);

  useEffect(() => {
    setReload(true);
    getURLFromFirestore(index, titulo)
      .then(({ url, isPdf }) => {
        if (isPdf) {
          setPdfurl({
            uri: url,
            cache: true,
          });
        } else {
          setImageUri(url);
        }

        setReload(false);
      })
      .catch((err) => {
        setReload(false);
      });
  }, []);

  const resizeImage = async (uri, width, height, format, quality) => {
    const response = await ImageResizer.createResizedImage(
      uri,
      width,
      height,
      format,
      quality
    );
    return response.uri;
  };

  const takePicture = async () => {
    setShowOption(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permisos de cámara no otorgados.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newUri = await resizeImage(
        result.assets[0].uri,
        800,
        600,
        "JPEG",
        50
      );
      setImageUri(newUri);

      setReload(true);
      try {
        await uploadImageDocument(newUri, index, titulo);
        setPdfurl(null);
        setReload(false);
        navigation.navigate("home");
        toastRef.current.show("Documento registrado correctamente", 2000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickDocument = async () => {
    setShowModalInfo(false);
    setShowOption(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pdfBlobURL = result.assets[0].uri;

        setReload(true);
        // Subir el PDF a Firebase Storage y obtener la URL de descarga
        try {
          uploadPDFToFirebase(pdfBlobURL, index, titulo)
            .then((url) => {
              setPdfurl({
                uri: url,
                cache: true,
              });
              setReload(false);
            })
            .catch((err) => {
              console.log(err);
              setReload(false);
            });
        } catch (error) {
          setReload(false);
          console.log(
            "Error al subir el archivo PDF a Firebase:",
            error.message
          );
        }
      } else {
        setReload(false);
        console.log("Se canceló la selección");
      }
    } catch (error) {
      setReload(false);
      console.log("Error al seleccionar el documento:", error);
    }
  };

  return (
    <ImageBackground source={background} style={styles.image}>
      <MenuFlotante
        isPDF={true}
        index={index}
        titulo={titulo}
        pdfurl={pdfurl ? pdfurl : null}
        imageUri={imageUri ? imageUri : null}
        setReload={setReload}
        setTxtLoad={setTxtLoad}
        toastRef={toastRef}
        isShowPDF={true}
      />
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
          marginTop: 70,
          marginBottom: 30,
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
            style={{ flex: 1, alignSelf: "stretch" }}
          />
        ) : imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.imgUrl}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require("../../assets/Iconos/NOPDF.png")}
            style={styles.nopdf}
          />
        )}

        <Loading isVisible={reload} text={txtLoad} />
      </SafeAreaView>
      <View style={styles.floatingButton3}>
        <Icon
          name="qrcode-scan"
          type="material-community"
          color="white"
          size={25}
          onPress={() => navigation.navigate("qrcode")}
        />
      </View>
      <View style={styles.floatingButton2}>
        <Icon
          name="information-variant"
          type="material-community"
          color="white"
          size={25}
          onPress={() => setShowModalInfo(true)}
        />
      </View>
      <View style={styles.floatingButton}>
        <Icon
          name="pencil"
          type="material-community"
          color="white"
          size={40}
          onPress={() => setShowOption(true)}
        />
      </View>
      <ModalInfo
        showModalInfo={showModalInfo}
        setShowModalInfo={setShowModalInfo}
        descripciones={descripciones}
        id={idDoc}
        realIndex={titulo}
      />
      <ModalOption
        showOption={showOption}
        setShowOption={setShowOption}
        pickDocument={pickDocument}
        takePicture={takePicture}
      />
    </ImageBackground>
  );
}

function ModalOption(props) {
  const { showOption, setShowOption, pickDocument, takePicture } = props;

  return (
    <Modal
      isVisible={showOption}
      setIsVisible={setShowOption}
      colorModal={"white"}
      close={true}
    >
      <Text style={styles.titulo}>¿Como quieres subir tu documento?</Text>
      <Button
        title={"Subir PDF"}
        buttonStyle={styles.btn}
        titleStyle={styles.txt}
        icon={<Icon type="material-community" name="file-pdf-box" />}
        onPress={pickDocument}
      />
      <Button
        title={"Tomar Foto"}
        buttonStyle={styles.btn}
        titleStyle={styles.txt}
        icon={<Icon type="material-community" name="camera" />}
        onPress={takePicture}
      />
    </Modal>
  );
}

function ModalInfo(props) {
  const { descripciones, showModalInfo, setShowModalInfo, id, realIndex } =
    props;

  console.log("que trae realIndex: " + realIndex);
  console.log("id que trae: " + id);
  const handleLinkPress = (url) => {
    Linking.openURL(url); // Abre la URL en el navegador
  };

  const renderDescription = () => {
    const description = descripciones[realIndex];

    if (!description) {
      return null; // Si la descripción está undefined, no renderizamos nada
    }
    const descriptionParts = description.split(" ");

    return descriptionParts.map((part, index) => {
      if (part.startsWith("http") || part.startsWith("www")) {
        // Si la parte comienza con http o www, es probable que sea una URL
        return (
          <Text
            key={index}
            style={{ color: primary, textDecorationLine: "underline" }}
            onPress={() => handleLinkPress(part)}
          >
            {part}{" "}
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
      colorModal={"white"}
      close={true}
    >
      <Text style={styles.titleInfo}>¿COMO LO OBTENGO?</Text>
      <ScrollView style={{ height: "80%" }}>
        <Text style={styles.descInfo}>{renderDescription()}</Text>
      </ScrollView>

      <Button
        title={"ENTENDIDO"}
        onPress={() => setShowModalInfo(false)}
        buttonStyle={styles.btnInfo}
        titleStyle={styles.txtbtnInfo}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  nopdf: {
    width: screenWidth / 1.5,
    height: screenHeight / 2.4,
    margin: 30,
  },
  iconst: {
    width: "50%",
    position: "absolute",
  },
  image: {
    height: "100%",
  },
  floatingButton: {
    position: "absolute",
    bottom: 40,
    right: 15,
    backgroundColor: primary, // Color de fondo del botón flotante
    borderRadius: 50, // Hacer el botón circular
    padding: 10,
  },
  floatingButton2: {
    position: "absolute",
    bottom: 120,
    right: 15,
    backgroundColor: primary, // Color de fondo del botón flotante
    borderRadius: 50, // Hacer el botón circular
    padding: 10,
  },
  floatingButton3: {
    position: "absolute",
    bottom: 180,
    right: 15,
    backgroundColor: primary, // Color de fondo del botón flotante
    borderRadius: 50, // Hacer el botón circular
    padding: 10,
  },
  titleInfo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: primary,
    marginBottom: 15,
  },
  descInfo: {
    color: "grey",
    width: "85%",
    marginLeft: 20,
    marginBottom: 15,
    fontSize: 15,
    textAlign: "left",
  },
  btnInfo: {
    backgroundColor: "transparent",
    width: "50%",
    alignSelf: "flex-end",
  },
  txtbtnInfo: {
    color: primary,
  },
  btn: {
    backgroundColor: "white",
  },
  txt: {
    color: "grey",
  },
  titulo: {
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "bold",
    width: "90%",
    fontSize: 15,
    marginBottom: 15,
  },
  imgUrl: {
    width: "100%", // Ancho al 100% del contenedor
    height: undefined, // Altura calculada según el aspecto original de la imagen
    aspectRatio: 2 / 3, // Relación de aspecto original de la imagen (ejemplo: 4:3)
    marginBottom: 50,
  },
});
