var mongoose = require("mongoose");
var Bicicleta = require("../../models/Bibicleta");
var request = require("request");
var server = require("../../bin/www");

var mongo2 = new mongoose.Mongoose();

var base_url = "http://localhost:3000/api/bicicletas";

describe("Bicicleta APi", () => {
    beforeEach(function (done) {
        setTimeout(function () {
            //Connection to the Database (Test Database)
            var mongoDB = "mongodb://localhost/testdb";
            mongo2.connect(mongoDB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            var db = mongo2.connection;
            db.on("error", console.error.bind(console, "connection error"));
            db.once("open", function () {
                console.log("We are connected to test database!");
            });
            done(); // es par terminar el beforeEach de otra manera no terminaria el metodo
        }, 100);
    });

    afterEach(function (done) {
        Bicicleta.deleteMany({}, function (err, success) {
            if (err) console.log(err);
            done();
        });
    });

    describe("GET Bicicletas", () => {
        it("Status ok-200", (done) => {
            request.get(base_url, function (err, res, body) {
                var result = JSON.parse(body);
                expect(res.statusCode).toBe(200);
                expect(result.bicis.length).toBe(0);
            });
            done();
        });
    });

    describe("POST Bicicletas /create", () => {
        it("Creacion de bicicleta", (done) => {
            var headers = {
                "content-type": "application/json",
            };
            var biciA = '{"code":2,"color":"blanco","modelo":"urbano","ltd":-34,"lng":-45} ';
            request.post({
                    headers: headers,
                    url: "http://localhost:3000/api/bicicletas/create",
                    body: biciA,
                },
                function (err, res, body) {
                    Bicicleta.findByCode(2).then((result) => (expect(result.color).toBe("blanco")));
                    expect(res.statusCode).toBe(200);
                    done();
                }
            );
        });
    });

    describe("Update Bicicletas /update", () => {
        it("Actualizar  bicicleta", (done) => {
            var headers = {
                "content-type": "application/json",
            };
            var biciA = '{"code":2,"color":"blanco","modelo":"urbano","ltd":-34,"lng":-45} ';
            request.post({
                    headers: headers,
                    url: "http://localhost:3000/api/bicicletas/create",
                    body: biciA,
                },
                function (err, res, body) {
                    request.put({
                            headers: headers,
                            url: "http://localhost:3000/api/bicicletas/update",
                            body: '{"code":2,"color":"Azul","modelo":"rural"}',
                        },
                        function (err_up, update_, update_bici) {
                            var bici = JSON.parse(update_bici)
                            expect(bici.bicicleta.color).toBe("Azul");
                            expect(bici.bicicleta.modelo).toBe("rural");
                            done();
                        }
                    );
                });


        });
    });

    describe("Update Bicicletas /update", () => {
        it("Actualizar  bicicleta", (done) => {
            var headers = {
                "content-type": "application/json",
            };
            var biciA = '{"code":2,"color":"blanco","modelo":"urbano","ltd":-34,"lng":-45} ';
            request.post({
                    headers: headers,
                    url: "http://localhost:3000/api/bicicletas/create",
                    body: biciA,
                },
                function (err, res, body) {
                    request.delete({
                            headers: headers,
                            url: "http://localhost:3000/api/bicicletas/delete",
                            body: '{"code":2}'
                        },
                        function (err_up, response) {
                            expect(response.statusCode).toBe(204);
                            Bicicleta.findOne({code:2}).then((result)=>{
                                expect(result).toBe(null);
                            });
                            done();
                        }
                    );
                });


        });
    });
});