var mongoose = requrie('mongoose')
var Bicicleta = require('../../models/bicicleta')
var Usuario = require('../../models/usuario')
var Reserva = require('../../models/reserva')

describe('Testing Usuarios', function(){
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
        Reserva.deleteMany({}, function(error, success){
            if (error) console.log (error)
            Usuario.deleteMany({}, function(error, success){
                if (error) console.log (error)
                Bicicleta.deleteMany({}, function(error, success){
                    if (error) console.log(error);
                    done()
                })
            })
        })
    })

    describe('Cuando un usuario hace una reserva', () => {
        it ("Debe existir la reserva", (done) => {
            const usuario = new Usuario({ nombre: "Federico"});
            usuario.save()
            const bicicleta = new Bicicleta({code: 1, color: "azul", modelo: "nueva"})
            bicicleta.save()

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate()+1)
            usuario.reservar(bicicleta.id, hoy, mañana, function(error, reserva){
                Reserva.find({}, populate("bicicleta").populate("usuario").exec(function(err, reservas){
                    console.log(reservas[0])
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done()
                }))
            })
        })
    })
})