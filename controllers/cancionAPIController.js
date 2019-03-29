var app = require('express').Router({mergeParams: true});
var CancionModel = require('../models/cancionModel');

/**
 *  Canciones
 *  GET /api/artistas/:artista_id/canciones -> Listado de canciones del artista (artista_id)
 *  GET /api/artistas/:artista_id/canciones/:id -> Obtener la cancion cuyo id es ID
 *  POST /api/artistas/:artista_id/canciones -> Agregar una cancion al artista (artista_id)
 *  PUT /api/artistas/:artista_id/canciones/:id -> Actualizar la cancion
 *  DELETE /api/artistas/:artista_id/canciones/:id -> Borrar la cancion
 */


// Listado de canciones del artista
app.get('/', function (req, res, next) {
    var artistaId = req.params.artista_id;
    CancionModel.find({ artista_id: artistaId }, (err, listado) => {
        if (err) {
            next(new Error("No se pudieron obtener las canciones"));
            return;
        }
        res.send(listado);
    });
});

// Obtener una cancion
app.get('/:id', function (req, res, next) {
    var cancionId = req.params.id;
    CancionModel.findById(cancionId, (err, cancion) => {
        if (err) {
            next(new Error("No se pudo encontrar la cancion"));
            return;
        }
        res.send(cancion);
    });
});

// Agregar una cancion
app.post('/', function (req, res, next) {
    var nombre = req.body.nombre;
    var duracion = req.body.duracion;
    var artistaId = req.params.artista_id
    var instancia = new CancionModel({ nombre: nombre, duracion: duracion, artista_id: artistaId });
    instancia.save((err, cancion) => {
        if (err) {
            next(new Error('No se pudo guardar la cancion'));
        }
        res.status(201).send(cancion); // Codigo HTTP 201 es creado
    });
});

// Actualizar una cancion
app.put('/:id', function (req, res, next) {
    var nombre = req.body.nombre;
    var duracion = req.body.duracion;
    var artistaId = req.params.artista_id;
    var cancionId = req.params.id;
    CancionModel.findByIdAndUpdate(
        cancionId,
        { nombre: nombre, duracion: duracion },
        (err, cancion) => {
            if (err) {
                next(new Error("No se pudo actualizar la cancion"));
            }
            res.send(cancion);
        }
    );
});

// Borrar la cancion
app.delete('/:id', function (req, res, next) {
    var cancionId = req.params.id;
    CancionModel.findByIdAndRemove(cancionId, (err, rta) => {
        if (err) {
            next(new Error('No se pudo borrar la cancion'));
        }
        res.status(204).send();
    });
});

module.exports = app;