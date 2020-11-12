const { bicicleta_create_get } = require("../controllers/bicicleta");

var Bicicleta = function ( id, color, modelo, ubicacion ) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function () {
    return "id " + this.id + " | color: " + this.color;
}

Bicicleta.allBicis = [],
Bicicleta.add = function (aBici) {
    Bicicleta.allBicis.push(aBici);
}

var a = new Bicicleta (1, "Rojo", "urbana", [ 48.216379, 16.3807524 ] )
var b = new Bicicleta (2, "Azul", "urbana", [ 48.2216748, 16.4005644 ] )

Bicicleta.add(a)
Bicicleta.add(b)

Bicicleta.findById = function (aBiciId) {
    var aBici = Bicicleta.allBicis.find( x => x.id == aBiciId);
    if (aBici) 
        return aBici
    else 
        throw new Error (`No existe una bicicleta con el id ${aBiciId}`)
}

Bicicleta.removeById = function (aBiciId) {
    for (var i = 0; 1 < Bicicleta.allBicis.length; i++ ){
        if (Bicicleta.allBicis[i].id == aBiciId) {
            Bicicleta.allBicis.splice(i, 1)
            break
        }
    }
}

module.exports = Bicicleta;