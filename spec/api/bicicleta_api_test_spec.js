var Bicicleta = require('../../models/bicicleta')
var request = require('request')
var server = require('../../bin/www')
var mongoose = require('mongoose')

var base_url = 'http://localhost/3000/api/bicicletas'


describe('Bicicleta API', () => {
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


    describe('GET_BICICLETAS /', () => {
        it('Status 200', (done) => {         
            request.get(base_url, function (error, response, body){
                var result = JSON.parse(body)
                expect(response.statusCode).toBe(200)
                expect(result.bicicletas.length).toBe(0)
                done()
            });
        })
    })

    describe('POST_BICICLETA /create', () => {
        it('STATUS 200', (done) => {
            var headers = {"content-type": "application/json"}
            var bici = '{ "code": 10, "color":"rojo", "modelo":"urbano", "lat": 48.1879864 , "lng": 16.3181423}'
            request.post({
                headers: headers,
                url: base_url + "/create",
                body: bici
            }, function (error, response, body){
                expect(response.statusCode).toBe(200)
                var bici = JSON.parse(body).bicicleta
                console.log(bici)

                expect(bici.color).toBe("rojo")
                expect(bici.modelo).toBe("urbano")
                expect(ubicacion[0]).toBe(48.1879864)
                expect(ubicacion[1]).toBe(16.3181423)
                done()
            })
        })
    })

    describe('DELETE_BICICLETA /delete', ()=> {
        it('STATUS 204', (done) => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -15]);
            Bicicleta.add(a, function(error, newBici){
                var headers = {"content-type": "application/json"}
                var aBici = '{"code" :  }'
                request.post({
                    headers: headers,
                    url: base_url + "/delete",
                    body: aBici
                }, function (error, response, body){
                    expect(response.statusCode).toBe(204)
                    expect(Bicicletas.allBicis.length).toBe(0)

                    done()
                })
            })
        })
    })
})
