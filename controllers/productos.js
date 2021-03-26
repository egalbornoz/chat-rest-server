/********************************************************************************
 * Importaciones necesarias
 ********************************************************************************/
const { response, json } = require('express');
const { Producto, Usuario } = require('../models');
const categoria = require('../models/categoria');
/********************************************************************************
 * Controlador obtenerProductos - paginado -total - populate
 ********************************************************************************/
const obtenerProductos = async (req = request, res = response) => {
    const filtro = { estado: true };
    const { limite = 5, desde = 0 } = req.query;  //Obtener del body el limite de paginación
    const [total, Productos] = await Promise.all([

        Producto.countDocuments(filtro),
        Producto.find(filtro) //dentro den find va la condicion
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        Productos,

    });
}
/********************************************************************************
* Controlador obtenerProducto - populate {retornar objeto categoria}
 ********************************************************************************/
const obtenerProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    res.json(
        producto
    );
}
/********************************************************************************
 * Controlador Crear Producto
 ********************************************************************************/
const crearProducto = async (req = request, res = response) => {
    const { estado, usuario, ...body } = req.body;

    const productoDb = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if (productoDb) {
        return res.status(400).json({
            msg: `El producto ${productoDb.nombre} ya existe`,
        })
    }
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    // Grabar los datos
    const producto = new Producto(data);
    await producto.save();
    res.status(201).json(producto);
}
/********************************************************************************
* Controlador actualizarProducto 
 ********************************************************************************/
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; // se excluyen elementos y el resto se actualiza
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);
}
/********************************************************************************
 * Controlador Borrar Producto
 ********************************************************************************/
const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    const producto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        producto,
    });
}
/********************************************************************************
 * Exportaciones Controladores
 ********************************************************************************/
module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}