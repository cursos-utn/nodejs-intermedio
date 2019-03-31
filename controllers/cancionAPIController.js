var app = require("express").Router({ mergeParams: true });
var service = require('../services/cancionService');

var CancionModel = require("../models/cancionModel");

/**
 *  Canciones
 *  GET /api/artistas/:artista_id/canciones -> Listado de canciones del artista (artista_id)
 *  GET /api/artistas/:artista_id/canciones/:id -> Obtener la cancion cuyo id es ID
 *  POST /api/artistas/:artista_id/canciones -> Agregar una cancion al artista (artista_id)
 *  PUT /api/artistas/:artista_id/canciones/:id -> Actualizar la cancion
 *  DELETE /api/artistas/:artista_id/canciones/:id -> Borrar la cancion
 */

// Listado de canciones del artista
app.get("/", function(req, res, next) {
  var artistaId = req.params.artista_id;
  service.list(artistaId).then(listado => {
    res.send(listado);
  }).catch( err => {
    next(new Error('No se pudieron obtener las canciones'));
  })
});

// Obtener una cancion
app.get("/:id", function(req, res, next) {
  var cancionId = req.params.id;
  service.get(cancionId).then( cancion => {
    res.send(cancion);
  }).catch( err => {
    next(new Error("No se pudo encontrar la cancion"));
  })
});

// Agregar una cancion
app.post("/", function(req, res, next) {
  var nombre = req.body.nombre;
  var duracion = req.body.duracion;
  var artistaId = req.params.artista_id;
  var instancia = new CancionModel({
    nombre: nombre,
    duracion: duracion,
    artista_id: artistaId
  });
  service.save(instancia, true).then( cancion => {
    res.status(201).send(cancion); // Codigo HTTP 201 es creado
  }).catch(err => {
    next(new Error("No se pudo guardar la cancion"));
  })
});

// Actualizar una cancion
app.put("/:id", function(req, res, next) {
  var nombre = req.body.nombre;
  var duracion = req.body.duracion;
  var artistaId = req.params.artista_id;
  var cancionId = req.params.id;
  var instancia = new CancionModel({
    nombre: nombre,
    duracion: duracion,
    artista_id: artistaId
  });
  service.save(instancia, false).then( cancion => {
    res.send(cancion);
  }).catch( err => {
    next(new Error("No se pudo actualizar la cancion"));
  })
});

// Borrar la cancion
app.delete("/:id", function(req, res, next) {
  var cancionId = req.params.id;
  service.delete(cancionId).then(rta => {
    res.status(204).send();
  }).catch(err => {
    next(new Error("No se pudo borrar la cancion"));
  })
});

// Retornar la letra de la cancion
app.get("/:id/lyrics", function(req, res, next) {
  // Debemos obtener el artista y la cancion por sus Ids
  // Realizar peticion a servidor de letras (Necesitamos componente de conexion. Usamos axios)
  // retornar la respuesta
  var artistaId = req.params.artista_id;
  var cancionId = req.params.id;
  service.lyrics(artistaId, cancionId).then(lyrics => {
    res.send(lyrics);
  }).catch(err => {
    next(new Error("No se pudo obtener la letra"));
  })
});

module.exports = app;
