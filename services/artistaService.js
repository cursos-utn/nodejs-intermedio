var ArtistaModel = require("../models/artistaModel");

module.exports.get = function(id) {
    return new Promise( (resolve, reject) => {
        ArtistaModel.findById(id, (err, respuesta) => {
            if (err) {
                reject(err);
            }
            resolve(respuesta);
        })
    })
}

module.exports.list = function() {
    return new Promise( (resolve, reject) => {
        ArtistaModel.find({}, (err, listado) => {
            if (err) {
                reject(err);
            }
            resolve(listado);
        })
    })
}

module.exports.save = function(instancia, esNuevo) {
    return new Promise( (resolve, reject) => {
        if (!esNuevo) {
            // Si tiene ID es una actualizacion (cuando es alta no tiene ID)
            ArtistaModel.findByIdAndUpdate(instancia._id, {nombre: instancia.nombre}, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            })
        } else {
            // Es alta
            instancia.save((err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        }
    })
}

module.exports.delete = function(id) {
    return new Promise( (resolve, reject) => {
        ArtistaModel.findByIdAndRemove(id, (err, data) => {
            if (err){
                reject(err);
            }
            resolve(data);
        })
    })
}