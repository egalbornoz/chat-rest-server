const { comprobarJWT } = require("../helpers");
//Se reuiere la clase ChatMensajes
const { ChatMensajes } = require('../models')

//SE crea la instancia de la clase ChatMensajes
const chatMensajes = new ChatMensajes();



//Se valida el token, si el usuario no existe - se desconecta del socket
const socketControler = async (socket = new Socket(), io) => {
    //Se recibe el token del cliente que se conecta
    await comprobarJWT;
    const usuario = await comprobarJWT(socket.handshake.headers['token']);
    if (!usuario) {
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    //Refrescar ultimos mensajes al nuevo usuario conectado 
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);


    //Conectarlos a una sala especial
    socket.join(usuario.id); //Sala Global ( socket.id)//Privada (usuario.id)
    //Limpiar cuando un usuario se desconecta
    socket.on('disconnect', () => {
        //Desconectamos el usuario
        chatMensajes.desconectarUsuario(usuario.id);
        // Se actualiza lista de usuarios conectados
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });
    //Enviar mensaje
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if (uid) {
            //Mensaje Privado
            socket.to(uid).emit('mensaje-privado',{ de: usuario.nombre, mensaje });
        } else {
            // Mensaje Global

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });


}

module.exports = {
    socketControler,

}