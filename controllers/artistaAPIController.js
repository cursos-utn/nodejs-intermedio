var app = require('express').Router();
var ArtistaModel = require('../models/artistaModel');


/**
 * API de Artistas
 *  GET /api/artistas -> listado de todos los artistas
 *  GET /api/artistas/:id -> Obtener el artista cuyo ID es pasado como parametro
 *  POST /api/artistas -> Agregar un artista
 *  PUT /api/artistas/:id -> Actualizar los datos del artista cuyo ID es pasado como parametro
 *  DELETE /api/artistas/:id -> Borrar el artista cuyo ID es pasado como parametros
 * 
 */


// Listado de artistas
app.get('/', function (req, res, next) {
    // Es el mismo codigo del listado de artistas normal (pero sin interfaz)
    ArtistaModel.find({}, (err, listado) => {
        if (err) {
            next(new Error('No se pudieron obtener los artistas'));
            return;
        }
        res.send(listado);
    });
});

// Obtener un artista
app.get('/:id', function (req, res, next) {
    var idArtista = req.params.id;
    ArtistaModel.findById(idArtista, (err, artista) => {
        if (err) {
            next(new Error('No se encontro el artista'));
        }
        res.send(artista);
    });
});

// Agregar un artista
app.post('/', function (req, res, next) {
    var nombre = req.body.nombre;
    var instancia = new ArtistaModel({ nombre: nombre });
    instancia.save((err, artista) => {
        if (err) {
            next(new Error('No se pudo guardar el artista'));
        }
        res.status(201).send(artista); // Codigo HTTP 201 es creado
    });
});

// Actualizar un artista
app.put('/:id', function (req, res, next) {
    var idArtista = req.params.id;
    var nombreNuevo = req.body.nombre;
    ArtistaModel.findByIdAndUpdate(idArtista, { nombre: nombreNuevo }, (err, artista) => {
        if (err) {
            next(new Error('No se pudo actualizar el artista'));
        }
        res.send(artista);
    })
});

// Borrar un artista
app.delete('/:id', function (req, res, next) {
    var idArtistaABorrar = req.params.id;
    ArtistaModel.findByIdAndRemove(idArtistaABorrar, (err, artista) => {
        if (err) {
            next(new Error('No se pudo borrar el artista'));
        }
        res.status(204).send(); // Codigo HTTP 204 Sin contenido (no hay nada que responder, pero la operacion fue exitosa)
    });
});

module.exports = app;