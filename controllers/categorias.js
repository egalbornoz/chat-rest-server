/********************************************************************************
 * Importaciones necesarias
 ********************************************************************************/
const { response, json } = require('express');
const { Categoria, Usuario } = require('../models');
/********************************************************************************
 * Controlador obtenerCategorias - paginado -total - populate
 ********************************************************************************/
const obtenerCategorias = async (req = request, res = response) => {
    const filtro = { estado: true };
    const { limite = 5, desde = 0 } = req.query;  //Obtener del body el limite de paginación
    const [total, categorias] = await Promise.all([

        Categoria.countDocuments(filtro),
        Categoria.find(filtro) //dentro den find va la condicion
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        categorias,

    });
}
/********************************************************************************
* Controlador obtenerCategoria - populate {retornar objeto categoria}
 ********************************************************************************/
const obtenerCategoria = async (req = request, res = response) => {
    const filtro = { estado: true };
    const { id } = req.params;
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre')

    res.json(
        categoria
    );
}
/********************************************************************************
 * Controlador Crear Categoria
 ********************************************************************************/
const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDb = await Categoria.findOne({ nombre });

    if (categoriaDb) {
        return res.status(400).json({
            msg: `La categoría ${categoriaDb.nombre} ya existe`,
        })
    }
    const data = {
        nombre,
        usuario: req.usuario._id
    }
    // Grabar los datos
    const categoria = new Categoria(data);
    await categoria.save();
    res.status(201).json(categoria);
}
/********************************************************************************
* Controlador actualizarCategoria 
 ********************************************************************************/
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body; // se excluyen elementos y el resto se actualiza
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
        data.usuario = req.usuario._id
    }
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);
}
/********************************************************************************
 * Controlador Borrar Categoria
 ********************************************************************************/
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const usuarioAut = req.usuario.nombre;
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
    res.json({
        categoria,
        usuarioAut
    });
}
/********************************************************************************
 * Exportaciones Controladores
 ********************************************************************************/
module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}