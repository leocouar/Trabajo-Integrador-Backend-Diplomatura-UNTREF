const express = require('express');
const connectDB = require('./database');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());


//Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de Productos !')
  })

// Rutas de productos
const productsRoutes = require('./products');
app.use('/api/productos', productsRoutes);

// Conectar a la base de datos
connectDB();

// Otros middlewares y configuraciones

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Example app listening on http://localhost:${PORT}`));