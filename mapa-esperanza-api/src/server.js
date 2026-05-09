// Importar las dependencias necesarias
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Para leer el archivo .env

// Importar tus rutas
const reportRoutes = require('./routes/report.routes');

// Crear la aplicación de Express
const app = express();

// Middlewares
app.use(cors()); // Permite la comunicación con tu app de Angular
app.use(express.json()); // Permite al servidor entender JSON

// Usar las rutas
app.use('/api', reportRoutes); // Todas las rutas de reportes empezarán con /api

// Definir el puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});