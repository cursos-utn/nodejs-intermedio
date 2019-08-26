var CancionModel = require("../models/cancionModel");
var ArtistaModel = require('../models/artistaModel');
var http = require("axios");


module.exports.get = function (id) {
    return new Promise((resolve, reject) => {
        CancionModel.findById(id, (err, respuesta) => {
            if (err) {
                reject(err);
            }
            resolve(respuesta);
        });
    });
};

module.exports.list = function (artistaId) {
    return new Promise((resolve, reject) => {
        CancionModel.find({ artista_id: artistaId }, (err, listado) => {
            if (err) {
                reject(err);
            }
            resolve(listado);
        });
    });
};

module.exports.save = function (instancia, esNuevo) {
    return new Promise((resolve, reject) => {
        if (!esNuevo) {
            // Si tiene ID es una actualizacion (cuando es alta no tiene ID)
            CancionModel.findByIdAndUpdate(
                instancia._id,
                { nombre: instancia.nombre, duracion: instancia.duracion },
                (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                }
            );
        } else {
            // Es alta
            instancia.save((err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        }
    });
};

module.exports.delete = function (id) {
    return new Promise((resolve, reject) => {
        CancionModel.findByIdAndRemove(id, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
};

module.exports.findByNombre = function (nombre) {
    return new Promise((resolve, reject) => {
        CancionModel.findOne({ nombre: nombre }, (err, respuesta) => {
            if (err) {
                reject(err);
            }
            resolve(respuesta);
        })
    })
}

module.exports.lyrics = function (artistaId, cancionId) {
    return new Promise((resolve, reject) => {
        ArtistaModel.findById(artistaId, (err, artista) => {
            if (!artista) {
                reject(new Error("No se encontro el artista"));
            }
            
    
            CancionModel.findById(cancionId, (err, cancion) => {
                if (err) {
                    reject(new Error("No se encontro la cancion"));
                }
                if (!cancion) {
                    reject(new Error("No se encontro la cancion"));
                }
                //console.log(cancion);
                var nombreArtista = artista.nombre;
                var nombreCancion = cancion.nombre;
                http
                    .get(
                        "https://api.lyrics.ovh/v1/" + nombreArtista + "/" + nombreCancion
                    )
                    .then(respuesta => {
                        resolve(respuesta.data.lyrics);
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        });
    });
};
