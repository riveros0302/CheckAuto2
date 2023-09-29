import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { getAllDataCarByUserIdAndIndex } from './Database/auto';
import auth from '@react-native-firebase/auth';

export const generatePDF = async (data) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0px;
      background-image: url('https://firebasestorage.googleapis.com/v0/b/checkauto-3f0c2.appspot.com/o/Utilidades%2FHECKAUTO.png?alt=media&token=e961fa77-b1ac-442a-b4bb-876bf6846998');
      background-repeat: no-repeat;
      background-attachment: fixed;
      background-position: center left;
      background-size: 60%;
    }
    .container {
      border: 5px solid #007ee6;
      padding: 20px;
    }
   
    .logo {
      width: 200px; /* ajusta el tamaño según tu logo */
      height: 100px; /* ajusta el tamaño según tu logo */
    }
    .logo-container {
      display: flex;
      justify-content: center; /* Centrar horizontalmente */
      align-items: center; /* Centrar verticalmente */
    }
    .title {
      margin-top: 5px;
      font-size: 18px;
      font-weight: bold;
    }
    .line {
      border-top: 1px solid red;
      margin: 10px 0;
    }
    .subtitle {
      font-size: 18px;
      font-weight: bold;
      margin-left: 50;
      padding-top: 10;
      color: #9c9c9c;
    }
    .info-list {
      list-style-type: none;
      padding-left: 20;
    }
  
    .info-list li {
      margin-bottom: 10px; /* Espacio entre elementos */
      color: #9c9c9c;
      font-weight: bold;
      font-size: 12px;
    }
  
    .info-list li ul {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }
  
    .info-list li ul li {
      margin-bottom: 10px; /* Espacio entre elementos */
    }
  
    .info-list li ul li::before {
      content: "▪"; /* Punto de viñeta */
      margin-right: 5px; /* Espacio entre la viñeta y el texto */
    }
  
    .info-list li ul li strong {
      margin-right: 10px; /* Espacio entre los puntos (:) y el texto */
      display: inline-block;
      width: 140px; /* Ancho fijo para los puntos (:) */
    }
    .footer {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .footer img {
      width: 100px; /* ajusta el tamaño según tus logos */
      height: 30px; /* ajusta el tamaño según tus logos */
    }
    
    .logos {
      display: flex; /* Alinea las imágenes horizontalmente */
      align-items: center; /* Alinea verticalmente las imágenes */
    }
    .back {
      display: flex; /* Alinea las imágenes horizontalmente */
      align-items: center; /* Alinea verticalmente las imágenes */
    }
    
    .logos img {
      margin-left: 10px; /* Espacio entre las imágenes */
    }
    .contact {
      border: 2px solid orange; /* Añade un borde naranja */
      padding: 5px; /* Ajusta el espaciado interno */
      font-size: 10px;
      color: #9c9c9c;
    }
   
  </style>
</head>
<body>

<div class="container">
  <div class="logo-container">
  <img src="https://firebasestorage.googleapis.com/v0/b/checkauto-3f0c2.appspot.com/o/Utilidades%2FLOGO.png?alt=media&token=0e697265-4126-474f-8eb0-645132f15e73" alt="Logo" class="logo">
</div>
<div class="line"></div>
  <div class="subtitle">INFORMACIÓN TÉCNICA</div>
  <ul class="info-list">
  <li>
    <ul>
      <li><strong>PROPIETARIO</strong>: ${data.Propietario?.toUpperCase()}</li>
      <li><strong>RUT</strong>: ${data.Rut?.toUpperCase()}</li>
      <li><strong>DIRECCION</strong>: ${data.Direccion?.toUpperCase()}</li>
    </ul>
  </li>
  <br/>
  <li>
    <ul>
      <li><strong>TIPO VEHICULO</strong>: ${data.Tipo?.toUpperCase()}</li>
      <li><strong>AÑO</strong>: ${data.Año?.toUpperCase()}</li>
      <li><strong>MARCA</strong>: ${data.Marca?.toUpperCase()}</li>
      <li><strong>MODELO</strong>: ${data.Modelo?.toUpperCase()}</li>
      <li><strong>PLACA PATENTE</strong>: ${data.Patente?.toUpperCase()}</li>
      <li><strong>N° MOTOR</strong>: ${data.Numero_Motor?.toUpperCase()}</li>
      <li><strong>N° CHASIS</strong>: ${data.Numero_Chasis?.toUpperCase()}</li>
      <li><strong>N° SERIE</strong>:</li>
      <li><strong>N° VIN</strong>:</li>
      <li><strong>COLOR</strong>: ${data.Color?.toUpperCase()}</li>
    </ul>
  </li>
  <br/>
  <li>
    <ul>
      <li><strong>COMBUSTIBLE</strong>: ${data.Combustible?.toUpperCase()}</li>
      <li><strong>RUEDAS</strong>: ${data.Rueda?.toUpperCase()}</li>
      <li><strong>AIRE(PSI)</strong>: ${data.Aire?.toUpperCase()}</li>
      <li><strong>TIPO LUCES</strong>: ${data.Luces?.toUpperCase()}</li>
      <li><strong>TRANSMISION</strong>: ${data.Transmision?.toUpperCase()}</li>
      <li><strong>CILINDRADA</strong>:${data.Motor?.toUpperCase()}</li>
      <li><strong>CONSUMO</strong>:</li>
      <li><strong>TIPO ACEITE</strong>: ${data.Aceite?.toUpperCase()}</li>
      <li><strong>MES REVISION</strong>:</li>
    </ul>
  </li>
</ul>
  <div class="line"></div>
  <div class="footer">
  <div class="contact">CONTACTO:
  RTWINSGAMES@GMAIL.COM
  </div>
  <div class="logos">
    <img src="https://firebasestorage.googleapis.com/v0/b/checkauto-3f0c2.appspot.com/o/Utilidades%2FGOOGLE_PLAY.png?alt=media&token=3a45cada-580a-4f35-992f-2e59d6e913f2" alt="Google Play Logo">
    <img src="https://firebasestorage.googleapis.com/v0/b/checkauto-3f0c2.appspot.com/o/Utilidades%2FAPP_STORE.png?alt=media&token=223c5256-009a-4118-af9e-fe32c41ff134" alt="App Store Logo">
  </div>
</div>
</div>

</body>
</html>
`;

  const file = await printToFileAsync({
    html: html,
    base64: false,
  });

  const namePDF = `${
    FileSystem.documentDirectory
  }${data.Marca?.toUpperCase()}_${data.Modelo?.toUpperCase()}_${
    data.Index
  }.pdf`;

  await FileSystem.moveAsync({
    from: file.uri,
    to: namePDF,
  });

  await shareAsync(namePDF);
};
