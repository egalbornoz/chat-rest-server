/********************************************************************************
 * Importaciones necesarias
 ********************************************************************************/
const { response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios',
];
/********************************************************************************
 * Validar ID de Mongo
 ********************************************************************************/
const validaId = (termino) => {
    let esMongoId = ObjectId.isValid(termino);
    return esMongoId
}
//Video 176 implementar busqueda de productos por categoria especifica
/********************************************************************************
 * Controlador Buscar  por Categorias
 ********************************************************************************/
const buscarCategorias = async (termino = '', res = response) => {

    if (validaId(termino)) {
        const categoria = await Categoria.findById(termino)
        .populate('usuario','nombre');
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i'); //Expresion regular del termini insensible a mayus
    const categorias = await Categoria.find({ nombre: regex, estado: true })
    .populate('usuario','nombre');
    res.json({
        results: categorias
    });
}
/********************************************************************************
 * Controlador Buscar por usuarios
 ********************************************************************************/
const buscarUsuarios = async (termino = '', res = response) => {

    if (validaId(termino)) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i'); //Expresion regular del termini insensible a mayus
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });
}
/********************************************************************************
 * Controlador Buscar por productos
 ********************************************************************************/
const buscarProductos = async (termino = '', res = response) => {

    if (validaId(termino)) {
        const producto = await Producto.findById(termino)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre');
    res.json({
        results: productos
    });
}
/********************************************************************************
 * Controlador Buscar
 ********************************************************************************/
const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);

            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Colección buscada no se encuentra implementada',
            });
    }
}
/********************************************************************************
 * Exportaciones 
 ********************************************************************************/
module.exports = {
    buscar,

}