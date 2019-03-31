var app = require("express").Router({ mergeParams: true });
var service = require("../services/cancionService");

var CancionModel = require("../models/cancionModel");

// /artistas/:artista_id/canciones
// Listado de canciones del artista
app.get("/", function(req, res, next) {
  var artistaId = req.params.artista_id;
  service
    .list(artistaId)
    .then(listado => {
      res.render("canciones_listado", {
        listado: listado,
        artista_id: artistaId
      });
    })
    .catch(err => {
      next(new Error("No se pudo acceder al listado de canciones"));
    });
});

app.get("/add", function(req, res, next) {
  var artistaId = req.params.artista_id;
  res.render("canciones_edicion", { obj: {}, artista_id: artistaId });
});

app.post("/add", function(req, res, next) {
  var artistaId = req.params.artista_id;
  var nombre = req.body.nombre;
  var duracion = req.body.duracion;

  var instancia = new CancionModel({
    nombre: nombre,
    duracion: duracion,
    artista_id: artistaId
  });
  service
    .save(instancia, true)
    .then(obj => {
      res.redirect("/artistas/" + artistaId + "/canciones"); // Redireccion al listado de canciones del artista
    })
    .catch(err => {
      next(new Error("No se pudo guardar la cancion"));
    });
});

app.get("/:id/edit", function(req, res, next) {
  var artistaId = req.params.artista_id;
  var cancionId = req.params.id;
  service
    .get(cancionId)
    .then(cancion => {
      res.render("canciones_edicion", {
        obj: cancion,
        artista_id: artistaId
      });
    })
    .catch(err => {
      next(new Error("No se pudo obtener la cancion"));
    });
});

app.post("/:id/edit", function(req, res, next) {
  var artistaId = req.params.artista_id;
  var cancionId = req.params.id;
  var nombre = req.body.nombre;
  var duracion = req.body.duracion;


  var instancia = new CancionModel({
    nombre: nombre,
    duracion: duracion,
    artista_id: artistaId
  });
  service
    .save(instancia, false)
    .then(cancion => {
      res.redirect("/artistas/" + artistaId + "/canciones");
    })
    .catch(err => {
      next(new Error("No se pudo obtener la cancion"));
    });  
});

app.get("/:id/delete", function(req, res, next) {
  var cancionId = req.params.id;
  var artistaId = req.params.artista_id;
  service.delete(cancionId).then( cancion => {
      res.redirect("/artistas/" + artistaId + "/canciones");
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
  service.lyrics(artistaId, cancionId).then( lyrics => {
      res.render('canciones_letra', {letra: lyrics});
  }).catch(err => {
      console.log(err);
      next(new Error('No se pudo conectar con el servidor'));
  })
});

module.exports = app;
