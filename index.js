var express = require('express');
var app = express();
var mongoose = require('mongoose');
var ArtistaModel = require("./models/artistaModel");
var CancionModel = require("./models/cancionModel");
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

app.use('/artistas', require('./controllers/artistaControllers')); // Handlebars
app.use('/artistas/:artista_id/canciones', require('./controllers/cancionController'));

app.use('/api/artistas', require('./controllers/artistaAPIController')); // API
app.use('/api/artistas/:artista_id/canciones', require('./controllers/cancionAPIController')); // API




app.use(myErrorHandler);

app.listen(3000, function () {
    console.log('Iniciando la aplicación en http://localhost:3000 <- copia esta URL en tu navegador');
});
