/********************************************************************************
 * Importaciones necesarias
 ********************************************************************************/
const { response, json } = require('express');
const bcrypjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

/********************************************************************************
 * Controlador login
 ********************************************************************************/
const login = async (req, res = response) => {

    const { correo, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario y/o contraseña no son válidos - email'
            })
        }
        if (usuario.estado === false) {
            return res.status(400).json({
                msg: 'Usuario y/o contraseña no son válidos - estado '
            })
        }
        const validarPass = bcrypjs.compareSync(contraseña, usuario.contraseña);

        if (!validarPass) {
            return res.status(400).json({
                msg: 'Usuario y/o contraseña no son válidos  - valipass'
            })
        }
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Algo salio mal, comunicar al administrador'
        })
    }
}
/********************************************************************************
 *  Controlador SigIn 
 ********************************************************************************/
const googleSigin = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { correo, nombre, img } = await googleVerify(id_token);
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                contraseña: ':P',
                img,
                google: true
            };
            usuario = new Usuario(data);
            await usuario.save();
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, Usuario bloqueado',
            });
        }
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es válido'
        })
    }
}
/********************************************************************************
 *  Controlador renovarToken
 ********************************************************************************/
const renovarToken = async (req, res = response) => {
    const { usuario } = req;
    //Generer JWT
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    })
}
/********************************************************************************
 *  Eportación controladores
 ********************************************************************************/

module.exports = {
    login,
    googleSigin,
    renovarToken
}