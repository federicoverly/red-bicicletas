var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis(function(err,bicis){
        res.status(200).json({Bicicletas:bicis});
    })
}

exports.bicicleta_create = function ( req, res) {
    var bici = new Bicicleta( req.body.id, req.body.color, req.body.modelo )
    bici.ubicacion = [ req.body.lat, req.body.lng ];

    Bicicleta.add(bici)

    res.status(200).json ({
        bicicleta: bici,
    })
}

exports.bicicleta_update = function ( req, res ) {
    var bici = Bicicleta.findById ( req.body.id)
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [ req.body.lat, req.body.lng ]

    res.status(200).json ({
        bicicleta: bici,
    })
}

exports.bicicleta_delete= function (req, res) {
    Bicicleta.removeById(req.body.id)
    res.status(204).send()
}

