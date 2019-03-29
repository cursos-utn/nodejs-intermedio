var app = require('express').Router();
var ArtistaModel = require('../models/artistaModel');

// Listado de artistas
app.get('/', function (req, res, next) {
    // 1. Obtengo los artistas de la base de datos
    // 2. Paso los artistas a una vista para que los muestre
    ArtistaModel.find({}, (err, listado) => {
        if (err) {
            next(new Error('No se pudieron obtener los artistas'));
            return;
        }
        res.render('artistas_listado', { listado: listado });
    });
});

// Formulario de alta de un artista
app.get('/add', function (req, res, next) {
    // Solo muestro el formulario de carga (una vista)
    res.render('artistas_edicion', { obj: {} });
});

// Guardar un nuevo artista
app.post('/add', function (req, res, next) {
    // 1. Recibir los datos del formulario
    // 2. Guardar
    var nombre = req.body.nombre;
    var instancia = new ArtistaModel({ nombre: nombre });
    instancia.save((err, artista) => {
        if (err) {
            next(new Error('No se pudo guardar el artista'));
        }
        res.redirect('/artistas'); // Si todo esta bien vuelve al listado de artistas
    });
});

// Borrar un artista
app.get('/:id/delete', function (req, res, next) {
    // 1. obtener el id del artista a borrar
    // 2. Borrar el artista
    // 3. Redireccionar al listado si todo esta bien
    var idArtistaABorrar = req.params.id;
    ArtistaModel.findByIdAndRemove(idArtistaABorrar, (err, artista) => {
        if (err) {
            next(new Error('No se pudo borrar el artista'));
        }
        res.redirect('/artistas');
    });
});

// Formulario de edicion de artista
app.get('/:id/edit', function (req, res, next) {
    // 1. Busco el artista por id
    // 2. Muestro el formulario de edicion y le paso el artista
    var idArtista = req.params.id;
    ArtistaModel.findById(idArtista, (err, artista) => {
        if (err) {
            next(new Error('No se encontro el artista'));
        }
        res.render('artistas_edicion', { obj: artista });
    });
});

// Actualizar un artista (recibe los datos enviados desde el formulario de edicion)
app.post('/:id/edit', function (req, res, next) {
    // 1. Busco el artista y actualizo sus datos
    // 2. Si esta todo bien, vuelvo al listado de artistas
    var idArtista = req.params.id;
    var nombreNuevo = req.body.nombre;
    ArtistaModel.findByIdAndUpdate(idArtista, { nombre: nombreNuevo }, (err, artista) => {
        if (err) {
            next(new Error('No se pudo actualizar el artista'));
        }
        res.redirect('/artistas');
    })

});

module.exports = app;