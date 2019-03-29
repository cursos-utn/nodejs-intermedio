var mongoose = require('mongoose');

var CancionSchema = mongoose.Schema({
    nombre: String,
    duracion: String,
    artista_id: {type: mongoose.Schema.Types.ObjectId, ref:'Artista'}
});

module.exports = mongoose.model('Cancion', CancionSchema);