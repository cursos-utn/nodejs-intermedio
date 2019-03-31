var app = require("express").Router();
var ArtistaModel = require("../models/artistaModel");
var service = require("../services/artistaService");

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
app.get("/", function(req, res, next) {
  service
    .list()
    .then(listado => {
      res.send(listado);
    })
    .catch(err => {
      next(new Error("No se pudieron obtener los artistas"));
    });
});

// Obtener un artista
app.get("/:id", function(req, res, next) {
  var idArtista = req.params.id;
  service
    .get(idArtista)
    .then(artista => {
      res.send(artista);
    })
    .catch(err => {
      next(new Error("No se encontro el artista"));
    });
});

// Agregar un artista
app.post("/", function(req, res, next) {
  var nombre = req.body.nombre;
  var instancia = new ArtistaModel({ nombre: nombre });
  service.save(instancia, true).then( artista => {
    res.status(201).send(artista); // Codigo HTTP 201 es creado
  }).catch(err => {
      next(new Error("No se pudo guardar el artista"));
  })
});

// Actualizar un artista
app.put("/:id", function(req, res, next) {
  var idArtista = req.params.id;
  var nombreNuevo = req.body.nombre;

  var instancia = new ArtistaModel({ _id: idArtista, nombre: nombre });
  service
    .save(instancia, false)
    .then(artista => {
      res.status(200).send(artista); // Codigo HTTP 201 es creado
    })
    .catch(err => {
      next(new Error("No se pudo guardar el artista"));
    });  
});

// Borrar un artista
app.delete("/:id", function(req, res, next) {
  var idArtistaABorrar = req.params.id;
  service.delete(id).then(obj => {
    res.status(204).send(); // Codigo HTTP 204 Sin contenido (no hay nada que responder, pero la operacion fue exitosa)
  }).catch(err => {
      next(new Error("No se pudo borrar el artista"));
  })

});

module.exports = app;
