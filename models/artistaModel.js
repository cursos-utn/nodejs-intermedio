var mongoose = require("mongoose");

// Definimos la estructura de los datos a guardar en Artista
var ArtistaSchema = mongoose.Schema({
    nombre: String
});

// Creamos un model (es la representacion del artista en nuestro sistema)
var ArtistaModel = mongoose.model('Artista', ArtistaSchema);

module.exports = ArtistaModel;