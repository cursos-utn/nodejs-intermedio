var express = require('express');
var app = express();
var mongoose = require('mongoose');
var ArtistaModel = require("./models/artistaModel");
var body_parser = require("body-parser");
var handlebars = require('express-handlebars').create({'defaultLayout': 'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Conexion con la base de datos MongoDB
mongoose.connect('mongodb://localhost/curso_nodejs_intermedio_m1u2', {}).then( () => {
    // Conexion exitosa
    console.log('Conexion exitosa con MongoDB');
}).catch( (err) => {
    console.log('No me pude conectar con MongoDB');
    console.log(err);
})



var myLogger = function(req, res, next) { // Esta funcion se va a ejecutar en cada peticion
    console.log('Paso por el logger');
    next();
}

var myErrorHandler = function(error, req, res, next) {
    console.log('Paso por el manejador de errores');
    console.log(error.message); // Mensaje de error
    res.status(error.status || 500); // Retornamos el estado del error o 500 si no tiene estado
    res.send(error.message);
}

// La informacion enviada por POST de un formulario se recibe en req.body
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());


app.use(myLogger);

app.get('/', function (request, response) {
    response.render('principal'); // views/principal.handlebars
    //response.send('Bienvenido al curso de NodeJS nivel Intermedio!');
});

// Ejemplos de llamada:
// /hola/orlando
// /hola/lorena
// ...
app.get('/hola/:nombre', function(req, res) { 
    var nombre = req.params.nombre;
    res.render('hola', {nombrePasadoEnURL: nombre});
});

app.get('/prueba', function(req, res, next) {
    // Vamos a generar un error
    next(new Error('Este error es de prueba y forzado'));
    //res.send('Respuesta de /prueba');
});

app.get('/agregar', function(req, res, next) {
    var instancia = new ArtistaModel({nombre: 'Nombre de prueba'});
    instancia.save( (err, artista) => {
        if (err) {
            // No se pudo guardar el artista
            console.log('No se pudo guardar el artista');
            res.send('No se pudo guardar el artista');
            return;
        }
        console.log('Artista guardado');
        res.send('Artista guardado');
    });
});

app.get('/listar', function(req, res, next) {
    ArtistaModel.find({}, (err, listado) => {
        if (err) {
            console.log('No se pueden listar los artistas');
            res.send('No se pueden listar los artistas');
            return;
        }
        res.send(listado);
    });
});


// Comienzo de la aplicacion

app.use('/artistas', require('./controllers/artistaControllers'));

// API de artistas /api/artistas

/**
 * API de Artistas
 *  GET /api/artistas -> listado de todos los artistas
 *  GET /api/artistas/:id -> Obtener el artista cuyo ID es pasado como parametro
 *  POST /api/artistas -> Agregar un artista
 *  PUT /api/artistas/:id -> Actualizar los datos del artista cuyo ID es pasado como parametro
 *  DELETE /api/artistas/:id -> Borrar el artista cuyo ID es pasado como parametros
 */


// Listado de artistas
app.get('/api/artistas', function(req, res, next) {
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
app.get('/api/artistas/:id', function (req, res, next) {
    var idArtista = req.params.id;
    ArtistaModel.findById(idArtista, (err, artista) => {
        if (err) {
            next(new Error('No se encontro el artista'));
        }
        res.send(artista);
    });
});

// Agregar un artista
app.post('/api/artistas', function (req, res, next) {
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
app.put('/api/artistas/:id', function (req, res, next) {
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
app.delete('/api/artistas/:id', function (req, res, next) {
    var idArtistaABorrar = req.params.id;
    ArtistaModel.findByIdAndRemove(idArtistaABorrar, (err, artista) => {
        if (err) {
            next(new Error('No se pudo borrar el artista'));
        }
        res.status(204).send(); // Codigo HTTP 204 Sin contenido (no hay nada que responder, pero la operacion fue exitosa)
    });
});

app.use(myErrorHandler);

app.listen(3000, function () {
    console.log('Iniciando la aplicación en http://localhost:3000 <- copia esta URL en tu navegador');
});
