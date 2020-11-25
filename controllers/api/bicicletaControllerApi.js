var Bicicleta = require("../../models/Bibicleta");

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis().then((result) => {
        res.status(200).json({
            bicis: result
        })
    })
}

exports.bicicleta_create = function (req, res) {
    var bici = Bicicleta.createInstance(
        req.body.code,
        req.body.color,
        req.body.modelo,
        [req.body.ltd, req.body.lng]
    );

    bici.save(function (err, result) {
        res.status(200).json({
            bici: result,
            mensaje: "agregada correctamente"
        })
    })

}

exports.bicicleta_update = function (req, res) {

    if (req.body.code) {
        Bicicleta.findByCode(req.body.code).then((result) => {
            console.log(result)
            result.color = req.body.color ? req.body.color : result.color;
            result.modelo = req.body.modelo ? req.body.modelo : result.modelo;
            result.ubicacion = [
                req.body.lat ? req.body.lat : result.ubicacion[0],
                req.body.lng ? req.body.lng : result.ubicacion[1]
            ]
            
            result.save().then((bici) => {
                res.status(200).json({
                    bicicleta: bici,
                    mensaje: "Modificada correctamente"
                })
            });
        }).catch((err)=>{
            console.log(err)
            res.status(404).json({
                mensaje: "No se a podido modificar revise los datos"
            })
        });
    } else {
        res.status(404).json({
            mensaje: "propiedad code no encontrada"
        })
    }
}

exports.bicicleta_delete = function (req, res) {
    Bicicleta.removeByCode(req.body.code, function (err, result) {
        res.status(204).json({
            mensaje: "borrado exitosamente " + result.n
        });
    })


}