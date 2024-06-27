// products.js
const express = require('express');
require('dotenv').config();
const router = express.Router();
const mongoose = require('mongoose');

// Definición del esquema del producto
const productoSchema = new mongoose.Schema({
    codigo: { type: Number, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    categorias: [{ type: String }]
});

const Producto = mongoose.model('electronicos', productoSchema);

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Filtrar productos por nombre (búsqueda parcial)
router.get('/search', async (req, res) => {
    try {
        const nombre = req.query.nombre;
        if (!nombre) {
            return res.status(400).json({ message: 'Debe proporcionar un nombre para buscar' });
        }

        const productos = await Producto.find({ nombre: new RegExp(nombre, 'i') });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    const nuevoProducto = new Producto({
        codigo: req.body.codigo,
        nombre: req.body.nombre,
        precio: req.body.precio,
        categorias: req.body.categorias
    });
    try {
        const saveProducto = await nuevoProducto.save();
        res.status(201).json(saveProducto);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const updateProducto = await Producto.findByIdAndUpdate(
            req.params.id,
            {
                codigo: req.body.codigo,
                nombre: req.body.nombre,
                precio: req.body.precio,
                categorias: req.body.categorias
            },
            { new: true }
        );
        if (!updateProducto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(201).json(updateProducto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar el precio de un producto
router.patch('/:id/precio', async (req, res) => {
    try {
        const updateProducto = await Producto.findByIdAndUpdate(
            req.params.id,
            { precio: req.body.precio },
            { new: true }
        );
        if (!updateProducto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(updateProducto);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const deleteProducto = await Producto.findByIdAndDelete(req.params.id);
        if (!deleteProducto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
