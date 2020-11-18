var mongoose = require('mongoose')
var Bicicleta = require('../../models/bicicleta')

describe('Testing Bicicletas', function(){
    beforeEach(function(done){
        var mongoDB = 'mongodb://localhost/testdb'
        mongoose.connect(mongoDB, { useNewUrlParser: true })

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'))
        db.once('open', function(){
            console.log('We are connected to test database');
            done();
        })
    })

    afterEach(function(done){
        Bicicleta.deleteMany({}, function (err, success){
            if (err) console.log(err);
            done();
        })
    })

    describe('Bicicleta.createInstance', () => {
        it('Crea una instancia de bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -15]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde")
            expect(bici.modelo).toBe("urbana")
            expect(bici.ubicacion[0]).toBe(-34.5)
            expect(bici.ubicacion[1]).toBe(15)
        })
    })

    describe('Bicicleta.allBicis', () => {
        it('Comienza vacía', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            })
        })
    })

    describe('Bicicleta.add', () => {
        it('Agrega una bici', (done) => {
            var aBici = Bicicleta.createInstance(1, "verde", "urbana");
            Bicicleta.add(aBici, function(error, newBici){
                if (err) console.log(err)
                Bicicleta.allBicis(function(error, bicis){
                    expect(bicis.length).toBe(1)
                    expect(bicis[0].code).toBe(aBici.code)

                    done();
                })
            })
        })
    });

    describe('Bicicleta.findByCode', () => {
        it('Encuentra una bici', (done) => {
            Bicicleta.allBicis(function(error, bicis){
                if (error) console.log(error);
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta ({ code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(error, newBici){
                    if (error) console.log(error)
                    
                    var aBici2 = new Bicicleta ({ code: 2, color: "rojo", modelo: "montaña"});
                    Bicicleta.add(aBici2, function(error, newBici){
                        if (error) console.log(error)
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code)
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        })
                    })

                })
            })
        })
    })

    describe('Bicicleta.deleteByCode', () => {
        it('Elimina una bici', (done) => {
            Bicicleta.allBicis(function(error, bicis){
                if (error) console.log(error);
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta ({ code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(error, newBici){
                    if (error) console.log(error)
                    
                    var aBici2 = new Bicicleta ({ code: 2, color: "rojo", modelo: "montaña"});
                    Bicicleta.add(aBici2, function(error, newBici){
                        if (error) console.log(error)
                        Bicicleta.deleteByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code)
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
        

                            done();
                        })
                    })

                })
            })
        })
    })

})

/* beforeEach( () => {
    Bicicleta.allBicis = []
})

describe('Bicicletas.allBicis', () => {
    it("Comienza vacío", () => {
        expect(Bicicleta.allBicis.length).toBe(0)
    })
})

describe('Bicicleta.add', () => {
    it('Agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0)
        
        var a = new Bicicleta (1, "Rojo", "urbana", [ 48.216379, 16.3807524 ] )
        Bicicleta.add(a)

        expect(Bicicleta.allBicis.length).toBe(1)        
        expect(Bicicleta.allBicis[0]).toBe(a)
    })
})

describe('Bicicleta.findById', () => {
    it('Debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0)
        var aBici = new Bicicleta (1, "verde", "urbana")
        var aBici2 = new Bicicleta (2, "azul", "urbana")
        Bicicleta.add(aBici)
        Bicicleta.add(aBici2)

        var targetBici = Bicicleta.findById(1)

        expect(targetBici.id).toBe(1)
        expect(targetBici.color).toBe(aBici.color)
        expect(targetBici.modelo).toBe(aBici.modelo)
    })
})

describe('Bicicleta.removeById', () => {
    it('Debe eliminar la bicicleta con el id', () => {
        expect(Bicicleta.allBicis.length).toBe(0)
        var aBici = new Bicicleta (1, "verde", "urbana")
        var aBici2 = new Bicicleta (2, "azul", "urbana")
        Bicicleta.add(aBici)
        Bicicleta.add(aBici2)

        var newBicis = Bicicleta.removeById(1)

        expect(Bicicleta.allBicis.length).toBe(1)
        expect(Bicicleta.allBicis[0]).toBe(aBici2)
    })
})
*/