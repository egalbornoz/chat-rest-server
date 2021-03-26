/***************************************************************************
 *  Importaciones
 ****************************************************************************/
const path = require('path');
const fs = require('fs');
const { response } = require("express");
const { subirArchivo, validarColeccion } = require("../helpers");
const { Usuario, Producto } = require('../models');
//Configuación de CLOUDINARY para el almacenamiento de imagenes  
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);
/***************************************************************************
 *  Contolador para carga de archivos
 ****************************************************************************/
cargarArchivos = async (req, res = response) => {

    try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'],'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });

    } catch (error) {
        res.status(400).json({ error })
    }
}
/***************************************************************************
 *  Contolador para actualizar imagen
 ****************************************************************************/
actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;
    modelo = await validarColeccion(id, coleccion);
    // Limpiar imagenes previas
    if (modelo.img) {
        //Borrar la imagen delservidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
    //Sube la imagen y guarda en DB
    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
    res.json(modelo);
}
/***************************************************************************
 *  Contolador para actualizar imagen  en Cloudinary
 ****************************************************************************/
actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;
    modelo = await validarColeccion(id, coleccion);
    // Limpiar imagenes previas

    if (modelo.img) {
        //Obtener el nombre de la imagen o id del string
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1]
        const [public_id] = nombre.split('.');
        //Eliminar la imagen de claudinary
        cloudinary.uploader.destroy(public_id);
    }
    // //Sube la imagen y guarda en DB
    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
    // // const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo);
}
/***************************************************************************
 *  Contolador para servir imagenes a solicitudes http desde el servidor
 ****************************************************************************/
const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;
    let modelo;

    // Limpiar imagenes previas
    modelo = await validarColeccion(id, coleccion);
    if (modelo.img) {
        //Borrar la imagen delservidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if (fs.existsSync(pathImagen)) {
            //Retorna la imagen solicitada
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);

}
/***************************************************************************
 *  Contolador para servir imagenes a solicitudes http desde cloudinary
 ****************************************************************************/
const mostrarImagenCloudinary = async (req, res = response) => {
    let modelo;
    const { id, coleccion } = req.params;
    // Limpiar imagenes previas
    modelo = await validarColeccion(id, coleccion);
    if (modelo.img) {
        //Borrar la imagen delservidor
        const { img } = modelo;
        //Retorna la imagen solicitada
        return res.send({ img });
    }
    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImagen);

}
/***************************************************************************
 *  Exportaciones
 ****************************************************************************/
module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary,

}