/********************************************************************************
 *  Importación JWT
 ********************************************************************************/
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/********************************************************************************
 *  Metodo para generar JWT
 ********************************************************************************/
const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {

        const payload = { uid };
        jwt.sign(payload, process.env.SECRET_JWT, {
            expiresIn: '24h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        })
    });

};
/********************************************************************************
 *  Metodo para comprobar JWT
 ********************************************************************************/
const comprobarJWT = async (token = '') => {
    try {
        if (token.length <= 10) {
            return null;
        }
        // Se extrae el ID del usuario y se verifica el TOKEN
        const { uid } = jwt.verify(token, process.env.SECRET_JWT);
        const usuario = await Usuario.findById(uid);
        if (usuario) {
            if (usuario.estado) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
/********************************************************************************
 *  Exportaciones
 ********************************************************************************/
module.exports = {
    generarJWT,
    comprobarJWT,
}