/******************************************************************
*  Importaciones
 ******************************************************************/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivos, mostrarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
//Inicialización
const router = Router();

/******************************************************************
*  EndPoint uploads o cargar Archivos
 ******************************************************************/
router.post('/', validarArchivo, cargarArchivos);

/******************************************************************
* EndPoint Actualizar foto Usuario
 ******************************************************************/
router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
], actualizarImagenCloudinary);

router.get('/:coleccion/:id', [
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
],mostrarImagenCloudinary);
/******************************************************************
*  Exportación Rutas - endPoints
 ******************************************************************/
module.exports = router;