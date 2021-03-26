/********************************************************************************
 * Importaciones necesaria
 ********************************************************************************/
const { response, request, json } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
/********************************************************************************
 * Controlador para obtener los usuarios activos con estado:true y paginados limite=?
 ********************************************************************************/
const usuariosGet = async (req = request, res = response) => {
    const filtro = { estado: true };
    const { limite = 5, desde = 0 } = req.query;  //Obtener del body el limite de paginación
    const [total, usuarios] = await Promise.all([

        Usuario.countDocuments(filtro),
        Usuario.find(filtro) //dentro den find va la condicion
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        usuarios
    });
}
/********************************************************************************
 * Controlador para actualizar los usuarios 
 ********************************************************************************/
const usuariosPut = async (req, res = response) => {
    const { id } = req.params; //Id configurado en la ruta router.put('/:id', usuariosPut);
    const { _id, contraseña, google, correo, ...resto } = req.body; // se excluyen elementos y el resto se actualiza
    if (contraseña) {
        const salt = bcrypt.genSaltSync();
        resto.contraseña = bcrypt.hashSync(contraseña, salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}
/********************************************************************************
 * Controlador crear los usuarios
 ********************************************************************************/
const usuariosPost = async (req, res = response) => {
    const { nombre, correo, contraseña, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, contraseña, rol });
    const salt = bcrypt.genSaltSync();

    usuario.contraseña = bcrypt.hashSync(contraseña, salt);
    await usuario.save();
    res.json({
        msg: usuario
    });
}
/********************************************************************************
 * Controlador elminar los usuarios  (Marcar estado=false)
 ********************************************************************************/
const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    const usuarioAut = req.usuario;

    res.json({ usuario, usuarioAut });
}
/********************************************************************************
 * Exportación de los modulos
 ********************************************************************************/
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
}