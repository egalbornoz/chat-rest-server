/********************************************************************************
 *  Importaciones
 ********************************************************************************/
const { response } = require('express');
const jwt = require('jsonwebtoken');
const { estimatedDocumentCount } = require('../models/usuario');
const Usuario = require('../models/usuario');

/********************************************************************************
 *  Método para validar token recibido del header
 ********************************************************************************/
const validarJWT = async (req, res = response, next) => {
    const token = req.header('token');
    // console.log(token);
    //Validar que se ha recibido un token
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición '
        });
    }
    // Validar que el token este firmado
    try {
        const { uid } = jwt.verify(token, process.env.SECRET_JWT);
        const usuario = await Usuario.findById(uid);
        req.usuario = usuario;
        // Verifico usuari exista

        if (!usuario) {
            return res.status(401).json({
                msg: 'El usuario no existe'
            })
        }
        //Verificar que el usuario tenga estado = true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario inactivo'
            });
        }
        next();
    } catch (error) {
        //console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}
/********************************************************************************
 *  Exportaciones
 ********************************************************************************/
module.exports = {
    validarJWT,
}