var Bicicleta = require("../../models/Bibicleta");
var mongoose = require("mongoose");
var mongoose1 = new mongoose.Mongoose;



describe("Testing Bicicleta", function () {
	beforeEach(function (done) {
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
		Bicicleta.deleteMany({}, function (err, success) {
			if (err) console.log(err);
			done();
		})
	});

	describe("Bicicleta.createInstantece", () => {
		it("Instancia de bicicleta ", () => {
			var bici = Bicicleta.createInstance(1, "verde", "urbana", [-32.314, -34.4232]);
			expect(bici.code).toBe(1);
			expect(bici.color).toBe("verde");
			expect(bici.modelo).toBe("urbana");
			expect(bici.ubicacion[0]).toBe(-32.314);
			expect(bici.ubicacion[1]).toBe(-34.4232);
		});
	});

	describe("Bicicleta.allBicis", () => {
		it("Comieza vacia ", (done) => {
			Bicicleta.allBicis(function (err, bicis) {
				expect(bicis.length).toBe(0);
				done();
			});

		});

	});


	describe("Bicicleta.add", () => {
		it("agregar  bicicleta ", (done) => {
			var bici = new Bicicleta({
				code: 1,
				color: "verde",
				modelo: "urbana"
			});
			Bicicleta.add(bici, function (err, newBici) {
				if (err) console.log(err);
				Bicicleta.allBicis(function (err2, bicis) {
					expect(bicis.length).toEqual(1);
					expect(bicis[0].code).toEqual(bici.code);
					done();
				})
			});
		});
	});


	describe("Bicicleta.findCode", () => {
		it("Buscar por codigo ", (done) => {
			Bicicleta.allBicis(function (err, bicis) {
				expect(bicis.length).toBe(0);

				var aBicis = new Bicicleta({
					code: 1,
					color: "verde",
					modelo: "urbano"
				});
				Bicicleta.add(aBicis, function (err2, abici) {
					if (err2) console.log(err2);

					var aBici2 = new Bicicleta({
						code: 2,
						color: "rojo",
						modelo: "montaña"
					});
					Bicicleta.add(aBici2, function (err3, newBici) {
						if (err3) console.log(err3);
						Bicicleta.findByCode(1, function (err4, targetBici) {
							expect(targetBici.code).toBe(aBicis.code);
							expect(targetBici.color).toBe(aBicis.color);
							expect(targetBici.modelo).toBe(aBicis.modelo);
							done();
						});
					});
				});
			})
		});
	});


});


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