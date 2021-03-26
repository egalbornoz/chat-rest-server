// *******************************************************************************
//  *  Clase Server
//  ********************************************************************************
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
const { createServer } = require('http');
const { socketControler } = require('../socket/controller');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        //Configuración del socket server
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);



        this.path = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',
            usuarios: '/api/usuarios',
        }
        // Conectar a la Base de Datos
        this.conectionDB();
        // Middlewares
        this.middleware();
        //Rutas de mi aplicación    
        this.routes();
        //Sockets
        this.sockets();

    }
    async conectionDB() {
        await dbConnection();
    }
    middleware() {

        //Cors limitar accesos al api
        this.app.use(cors());
        // Parseo y lectura del body
        this.app.use(express.json())
        // Directorio Público
        this.app.use(express.static('public'));
        //File Uploads - Carga de Archivos
        //createParentPath:true permite crear la carpera cuando se envia por parametro
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        //  Aqui se configuran las rutas a acceder desde  mi controlador
        this.app.use(this.path.auth, require('../routes/auth'));
        this.app.use(this.path.buscar, require('../routes/buscar'));
        this.app.use(this.path.usuarios, require('../routes/usuarios'));
        this.app.use(this.path.uploads, require('../routes/uploads'));
        this.app.use(this.path.categorias, require('../routes/categorias'));
        this.app.use(this.path.productos, require('../routes/productos'));
    }

    sockets() {
        this.io.on("connection", (socket) => socketControler(socket, this.io));
    }


    listen() {
        this.server.listen(this.port, () => {
            console.log(`Server activo por el puerto ${this.port}`)

        });
    }
}
// ************************************************************************
// *  Exportaciones
// ************************************************************************

module.exports = Server