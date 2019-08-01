
const chai = require('chai');


const assert = chai.assert;


describe('Casos de testeo', () => {

    before( () => {
        console.log('Al iniciar casos de testeo')
    })

    beforeEach(() => {
        console.log('Antes de cada caso de testeo')
    })    

    after( () => {
        console.log('Ejecutado al final de todos los testeos')
    })

    afterEach( () => {
        console.log('Ejecutado al finalizar cada caso')
    })

    it('Caso 1', () => {
        assert(true, 'True es true');
    })

    it('Caso 2', () => {
        assert(true, 'True es true');
    })

    it('Caso 3', () => {
        assert(true, 'True es true');
    })    

})