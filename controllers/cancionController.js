var app = require('express').Router({mergeParams: true});
var CancionModel = require('../models/cancionModel');

// /artistas/:artista_id/canciones 
// Listado de canciones del artista
app.get('/', function(req, res, next) {
    var artistaId = req.params.artista_id;
    CancionModel.find({artista_id: artistaId}, (err, listado) =>{
        if (err) {
            next(new Error('No se pudo acceder al listado de canciones'));
        }
        res.render('canciones_listado', {listado: listado, artista_id: artistaId});
    });
})

app.get('/add', function(req, res, next) {
    var artistaId = req.params.artista_id;
    res.render("canciones_edicion", { obj: {}, artista_id: artistaId });
});

app.post('/add', function(req, res, next) {
    var artistaId = req.params.artista_id;
    var nombre = req.body.nombre;
    var duracion = req.body.duracion;

    var instancia = new CancionModel({nombre: nombre, duracion: duracion, artista_id: artistaId});
    instancia.save((err, obj) => {
        if (err) {
            next(new Error('No se pudo guardar la cancion'));
        }
        res.redirect('/artistas/'+artistaId+'/canciones'); // Redireccion al listado de canciones del artista
    })
});

app.get('/:id/edit', function(req, res, next) {
    var artistaId = req.params.artista_id;
    var cancionId = req.params.id;
    CancionModel.findById(cancionId, (err, cancion) => {
        if (err) {
            next(new Error('No se pudo obtener la cancion'));
        }
        res.render('canciones_edicion', {obj: cancion, artista_id: artistaId});
    });
});

app.post('/:id/edit', function(req, res, next) {
    var artistaId = req.params.artista_id;
    var cancionId = req.params.id;
    var nombre = req.body.nombre;
    var duracion = req.body.duracion;

    CancionModel.findByIdAndUpdate(cancionId, {nombre: nombre, duracion: duracion}, (err, cancion) => {
        if (err) {
            next(new Error('No se pudo guardar la cancion'));
        }
        res.redirect('/artistas/'+artistaId+'/canciones');
    });
});

app.get('/:id/delete', function(req, res, next) {
    var cancionId = req.params.id;
    var artistaId = req.params.artista_id;
    CancionModel.findByIdAndRemove(cancionId, (err, cancion) => {
        if (err) {
            next(new Error('No se pudo borrar la cancion'));
        }
        res.redirect('/artistas/'+artistaId+'/canciones');
    })
})

module.exports = app;