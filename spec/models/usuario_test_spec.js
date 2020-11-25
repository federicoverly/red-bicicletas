const mongoose1 = require("mongoose");
const Bibicleta = require("../../models/Bibicleta");
const Reserva = require("../../models/reserva");
const Usuario = require("../../models/usuario");

describe("Testing Usuarios",function () {
    beforeEach(function (done) {

    mongoose1.disconnect()
		setTimeout(function () {
			//Connection to the Database (Test Database)
			var mongoDB = 'mongodb://localhost/testdb'
			mongoose1.connect(mongoDB, {
				useNewUrlParser: true
			})
			const db = mongoose1.connection;
			db.on('error', console.error.bind(console, 'connection error'));
			db.once('open', function () {
				console.log('We are connected to test database!');
			});
			done(); // es par terminar el beforeEach de otra manera no terminaria el metodo
		}, 100);
	});

	afterEach(function (done) {
		Reserva.deleteMany({}, function (err, success) {
            if (err) console.log(err);
            Usuario.deleteMany({},function (err,success) {
                if (err) console.log(err);
                Bibicleta.deleteMany({},function (err,success) {
                    if (err)console.log(err)
                    done();
                })
            })
			done();
		})
    });
    
    describe("Usuaro Reserba Bici", ()=>{
        it("existe reserva",(done)=>{
            const usuario = new Usuario({nombre:"Israel",email:"israelpat42@gmail.com",contraseña:"1234"});
            usuario.save();
            const bici = new Bibicleta({code:1,color:"rojo",modelo:"urabana",ubicacion:[-35,-37.9]});
            bici.save();

            var hoy = new Date();
            var mañana = new Date();
            mañana.setDate(hoy.getDate()+1);
            usuario.reservar(bici.id,hoy,mañana,function(err,reserva){
                Reserva.find({}).populate("usuario").populate("bicicleta").exec(function (err,reservas) {
                    //console.log(reservas[0].bicicleta.code);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();


                    
                })
            });
        })
    });
})