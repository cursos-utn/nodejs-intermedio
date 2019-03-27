var express = require('express');
var app = express();

var myLogger = function(req, res, next) { // Esta funcion se va a ejecutar en cada peticion
    console.log('Paso por el logger');
    next();
}

app.use(myLogger);

app.get('/', function (request, response) {
    response.send('Bienvenido al curso de NodeJS nivel Intermedio!');
});

app.get('/prueba', function(req, res) {
    res.send('Respuesta de /prueba');
});

app.listen(3000, function () {
    console.log('Iniciando la aplicación en http://localhost:3000 <- copia esta URL en tu navegador');
});