var express = require('express');
var app = express();

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

app.use(myLogger);

app.get('/', function (request, response) {
    response.send('Bienvenido al curso de NodeJS nivel Intermedio!');
});

app.get('/prueba', function(req, res, next) {
    // Vamos a generar un error
    next(new Error('Este error es de prueba y forzado'));
    //res.send('Respuesta de /prueba');
});

app.use(myErrorHandler);

app.listen(3000, function () {
    console.log('Iniciando la aplicación en http://localhost:3000 <- copia esta URL en tu navegador');
});
