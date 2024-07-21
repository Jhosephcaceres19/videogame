const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("../router/index.js"); // Importa las rutas definidas en el archivo index.js del directorio router
require("./db.js"); // Importa la configuración de la base de datos desde el archivo db.js

const app = express(); // Crea una nueva instancia de la aplicación Express

app.name = "API"; // Establece el nombre de la aplicación como "API"

// Configuración de middlewares
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // Middleware para analizar cuerpos de solicitud codificados en URL
app.use(bodyParser.json({ limit: "50mb" })); // Middleware para analizar cuerpos de solicitud en formato JSON
app.use(cookieParser()); // Middleware para analizar cookies de solicitud
app.use(morgan("dev")); // Middleware para registrar las solicitudes HTTP en la consola en modo 'dev'

// Middleware para configurar los encabezados CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Permite solicitudes desde cualquier origen (actualízalo según tus necesidades)
  res.header("Access-Control-Allow-Credentials", "true"); // Permite el envío de credenciales (cookies, HTTP auth) en las solicitudes
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Define los encabezados permitidos en las solicitudes CORS
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE"); // Define los métodos HTTP permitidos en las solicitudes CORS
  next();
});

app.use("/", routes); // Monta las rutas definidas en el archivo index.js en la ruta raíz '/'

// Middleware para capturar errores
app.use((err, req, res, next) => {
  const status = err.status || 500; // Obtiene el código de estado del error (o establece 500 por defecto)
  const message = err.message || err; // Obtiene el mensaje de error (o el error mismo si no hay mensaje)
  console.error(err); // Registra el error en la consola
  res.status(status).send(message); // Envía la respuesta de error al cliente
});

module.exports = app; // Exporta la aplicación Express para que pueda ser utilizada en otros archivos
