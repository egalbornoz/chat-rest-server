/********************************************************************************
 * Importaciones necesarias
 ********************************************************************************/
const { Router } = require('express');
const { check } = require('express-validator');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT,
    validarCampos,
    esAdminRole } = require('../middlewares');

const { crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto } = require('../controllers/productos');
const router = Router();
/********************************************************************************
 *Ruta Obtener todas los productos - publico  endPoint
 ********************************************************************************/
router.get('/', obtenerProductos);

/********************************************************************************
 *Ruta Obtener una producto por id - publico endPoint
 ********************************************************************************/
router.get('/:id', [
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
    obtenerProducto,
]);
/********************************************************************************
 *Ruta Crear producto - privado - cualquier persona con token válido - endPoint
 ********************************************************************************/
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un  id Mongo ').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos,
], crearProducto,
);
/********************************************************************************
 *Ruta  Actualizar Producto - privado - cualquier persona con token válido - endPoint
*********************************************************************************/
router.put('/:id', [
    validarJWT,
    // check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], actualizarProducto);
/********************************************************************************
 *Ruta  Eliminar producto Solo administrador  - endPoint
*********************************************************************************/
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);
/********************************************************************************
 *  Exportación Rutas 
*********************************************************************************/
module.exports = router;