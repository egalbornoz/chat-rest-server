// **************************************************************
// * Modelo Usuario
// **************************************************************

const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
      nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },

    contraseña: {
        type: String,
        required: [true, 'La contraseña es obogatoria']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default:'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});
//************************************************************************ */
// Se sobre escribe el metodo para personalizar
// validaciones(excluir eementos del objeto toJSON devuelto)
//*********************************************************************** */
UsuarioSchema.methods.toJSON = function(){
    const {__v, contraseña,_id,...usuario} = this.toObject();
   usuario.uid=_id;
    return  usuario;
}
//*********************************************************************** */
// Exportaciones
//*********************************************************************** */
module.exports = model('Usuario',UsuarioSchema);