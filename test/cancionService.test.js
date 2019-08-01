
const chai = require('chai');
const nock = require('nock');

const assert = require('chai').assert;
const expect = require('chai').expect;
require('chai').should();

const server = require('../index');

const artistaModel = require('../models/artistaModel');
const cancionModel = require('../models/cancionModel');
const cancionService = require('../services/cancionService');
const artistaService = require('../services/artistaService');

describe("cancionService", () => {
    let artista = null
    let cancion = null

    before(async () => {

        artista = await artistaService.findByNombre('Madonna');
        if (!artista) { // No existe => hay que crearlo
            artista = new artistaModel({ nombre: 'Madonna' });
            artista = await artistaService.save(artista, true);
        }
        cancion = await cancionService.findByNombre('Like a Prayer');
        if (!cancion) { // No existe => hay que crearlo
            cancion = new cancionModel({ nombre: 'Like a Prayer', duracion: "3:34", artista_id: artista._id });
            cancion = await cancionService.save(cancion, true);
        }
    })

    it('peticion ok', async () => {
        const mockServer = nock('https://api.lyrics.ovh').get('/v1/Madonna/Like%20a%20Prayer').reply(200, {lyrics:'letra ok'});
        const respuesta = await cancionService.lyrics(artista._id, cancion._id)
        respuesta.should.not.be.null;
    })

    it('peticion letra no encontrada', async () => {
        try {
            const mockServer = nock('https://api.lyrics.ovh').get('/v1/Madonna/Like%20a%20Prayer').reply(404, {});
            const respuesta = await cancionService.lyrics(artista._id, cancion._id)
            assert.ok(false)
        } catch(e) {
            e.should.not.be.null
        }

    })

    after(function (done) {
        server.close();
        done();
    });

})

