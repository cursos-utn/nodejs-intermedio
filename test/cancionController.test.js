
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
            res.should.have.status(200);
            done();
        })
    })


})

