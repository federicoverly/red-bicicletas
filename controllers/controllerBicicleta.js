var Bicicleta = require("../models/Bibicleta");

exports.bicicleta_list = function (req, res) {
    
    Bicicleta.allBicis().then((result) => {
        res.render('bicicletas/index', {
            bicis: result
        });
    })  
}

exports.bibicleta_create_get = function (req, res) {
    res.render("bicicletas/create");
}

exports.bibicleta_create_post = function (req, res) {
    var bici = Bicicleta.createInstance(
        req.body.code,
        req.body.color,
        req.body.modelo,
        [req.body.ltd, req.body.lng]
    );

    bici.save(function (err, result) {
        res.redirect("/bicicletas");
    });
}

exports.bibicleta_update_get = function (req, res) {
    Bicicleta.findByCode(req.params.code).then((result)=>{
        var bici = result
        res.render("bicicletas/update",{bici});
    });
   
}

exports.bibicleta_update_post = function (req, res) {

    if (req.body.code) {
        Bicicleta.findByCode(req.body.code).then((result) => {
            result.color = req.body.color ? req.body.color : result.color;
            result.modelo = req.body.modelo ? req.body.modelo : result.modelo;
            result.ubicacion = [
                req.body.lat ? req.body.lat : result.ubicacion[0],
                req.body.lng ? req.body.lng : result.ubicacion[1]
            ]
            
            result.save().then((bici) => {
                res.redirect("/bicicletas")
            });
        }).catch((err)=>{
            
        });
    } else {
        res.redirect("/bicicletas")
    }
}
exports.bicicleta_delete_post= function (req,res) {
    Bicicleta.removeByCode(req.body.code).then((result)=>{
        res.redirect("/bicicletas")
    });
}