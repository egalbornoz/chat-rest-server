/********************************************************************************
 * Importaciones necesarias
 ********************************************************************************/
const { Router } = require('express');
const { check } = require('express-validator');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT,
    validarCampos,
    esAdminRole } = require('../middlewares');

const { crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria } = require('../controllers/categorias');
const router = Router();
/********************************************************************************
 *Ruta Obtener todas las categorias - publico  endPoint
 ********************************************************************************/
router.get('/', obtenerCategorias);

/********************************************************************************
 *Ruta Obtener una categoria por id - publico endPoint
 ********************************************************************************/
router.get('/:id', [
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
    obtenerCategoria,
]);
/********************************************************************************
 *Ruta Crear categoria - privado - cualquier persona con token válido - endPoint
 ********************************************************************************/
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria,
);
/********************************************************************************
 *Ruta  Actualizar categoria - privado - cualquier persona con token válido - endPoint
*********************************************************************************/
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
], actualizarCategoria);
/********************************************************************************
 *Ruta  Eliminar Solo administrador  - endPoint
*********************************************************************************/
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);
/********************************************************************************
 *  Exportación Rutas 
*********************************************************************************/
module.exports = router;