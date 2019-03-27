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

// Listado de artistas
app.get('/artistas', function(req, res, next) {
    // 1. Obtengo los artistas de la base de datos
    // 2. Paso los artistas a una vista para que los muestre
    ArtistaModel.find({}, (err, listado) => {
        if (err) {
            next(new Error('No se pudieron obtener los artistas'));
            return;
        }
        res.render('artistas_listado', {listado: listado});
    });
});

// Formulario de alta de un artista
app.get('/artistas/add', function(req, res, next) {
    // Solo muestro el formulario de carga (una vista)
    res.render('artistas_edicion', { obj: {} });
});

// Guardar un nuevo artista
app.post('/artistas/add', function(req, res, next) {
    // 1. Recibir los datos del formulario
    // 2. Guardar
    var nombre = req.body.nombre;
    var instancia = new ArtistaModel({nombre: nombre});
    instancia.save( (err, artista) => {
        if (err) {
            next(new Error('No se pudo guardar el artista'));
        }
        res.redirect('/artistas'); // Si todo esta bien vuelve al listado de artistas
    });
});

// Borrar un artista
app.get('/artistas/:id/delete', function(req, res, next) {
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
app.get('/artistas/:id/edit', function(req, res, next) {
    // 1. Busco el artista por id
    // 2. Muestro el formulario de edicion y le paso el artista
    var idArtista = req.params.id;
    ArtistaModel.findById(idArtista, (err, artista) => {
        if (err) {
            next(new Error('No se encontro el artista'));
        }
        res.render('artistas_edicion', {obj: artista});
    });
});

// Actualizar un artista (recibe los datos enviados desde el formulario de edicion)
app.post('/artistas/:id/edit', function(req, res, next) {
    // 1. Busco el artista y actualizo sus datos
    // 2. Si esta todo bien, vuelvo al listado de artistas
    var idArtista = req.params.id;
    var nombreNuevo = req.body.nombre;
    ArtistaModel.findByIdAndUpdate(idArtista, {nombre: nombreNuevo}, (err, artista) => {
        if (err) {
            next(new Error('No se pudo actualizar el artista'));
        }
        res.redirect('/artistas');
    })

});

app.use(myErrorHandler);

app.listen(3000, function () {
    console.log('Iniciando la aplicación en http://localhost:3000 <- copia esta URL en tu navegador');
});
