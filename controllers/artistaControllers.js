var app = require("express").Router();
var ArtistaModel = require("../models/artistaModel");
var service = require("../services/artistaService");

// Listado de artistas
app.get("/", function(req, res, next) {
  service
    .list()
    .then(listado => {
      res.render("artistas_listado", { listado: listado });
    })
    .catch(err => {
      next(new Error("No se pudieron obtener los artistas"));
    });
});

// Formulario de alta de un artista
app.get("/add", function(req, res, next) {
  // Solo muestro el formulario de carga (una vista)
  res.render("artistas_edicion", { obj: {} });
});

// Guardar un nuevo artista
app.post("/add", function(req, res, next) {
  // 1. Recibir los datos del formulario
  // 2. Guardar
  var nombre = req.body.nombre;
  var instancia = new ArtistaModel({ nombre: nombre });
  service.save(instancia, true).then( artista => {
    res.redirect("/artistas"); // Si todo esta bien vuelve al listado de artistas  
  }).catch(err => {
      next(new Error("No se pudo guardar el artista"));
  });
});

// Borrar un artista
app.get("/:id/delete", function(req, res, next) {
  // 1. obtener el id del artista a borrar
  // 2. Borrar el artista
  // 3. Redireccionar al listado si todo esta bien
  var idArtistaABorrar = req.params.id;
  service.delete(idArtistaABorrar).then( obj => {
      res.redirect("/artistas");
  }).catch(err => {
      next(new Error("No se pudo borrar el artista"));
  })
});

// Formulario de edicion de artista
app.get("/:id/edit", function(req, res, next) {
  // 1. Busco el artista por id
  // 2. Muestro el formulario de edicion y le paso el artista
  var idArtista = req.params.id;
  service.get(idArtista).then( artista => {
    res.render("artistas_edicion", { obj: artista });
  }).catch( err => {
    next(new Error("No se encontro el artista"));
  });
  
});

// Actualizar un artista (recibe los datos enviados desde el formulario de edicion)
app.post("/:id/edit", function(req, res, next) {
  // 1. Busco el artista y actualizo sus datos
  // 2. Si esta todo bien, vuelvo al listado de artistas
  var idArtista = req.params.id;
  var nombreNuevo = req.body.nombre;
  var instancia = new ArtistaModel({ _id: idArtista, nombre: nombreNuevo });
  service
    .save(instancia, false)
    .then(artista => {
      res.redirect("/artistas"); // Si todo esta bien vuelve al listado de artistas
    })
    .catch(err => {
      next(new Error("No se pudo guardar el artista"));
    });
});

module.exports = app;
