
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
require('chai').should();


describe('Pagina principal', () => {

    var server;
    before(function () {
        server = require('../index');
    });
    after(function (done) {
        server.close();
        done();
    });    

    it('Obtener pagina principal', (done) => {
        chai.request(server).get('/').end( (err, res) => {
            console.log(res.text);
            res.should.have.status(200);
            done();
        })
    })

    it('Listado de artistas', (done) => {
        chai.request(server).get('/api/artistas').end( (err, res) => {
            //console.log(res);
            res.should.have.status(200);
            done();
        } )
    });

    it('Agregar un artista', (done) => {
        chai.request(server).post('/api/artistas').send({nombre: 'Artista A'}).end((err, res) => {
            //console.log(res);
            res.should.have.status(201);
            done();
        }) 
    })
})

