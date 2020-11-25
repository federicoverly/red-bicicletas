const Usuario = require("../models/usuario")

exports.list = function (req, res) {
    Usuario.find({}, function (err, usuarios) {
        res.render("usuarios/index", {
            usuarios: usuarios
        });
    });
};


exports.update_get = function (req, res) {
    Usuario.findById(req.params.id, function (err, usuario) {
        res.render("usuarios/update", {
            errors: {},
            usuario: usuario
        })
    })
};


exports.update = function (req, res) {
    var updates_values = {
        nombre: req.body.nombre
    }
    Usuario.findByIdAndUpdate(req.params.id, updates_values, function (err, usuario) {
        if (err) {
            console.log(err);
            res.render("usuarios/update", {
                errors: err.errors,
                usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email
                })
            });
        } else {
            res.redirect("/usuarios");
            return;
        }
    })
};


exports.create_get = function (req, res) {
    res.render("usuarios/create", {
        errors: {},
        usuario: new Usuario()
    })
};


exports.create = function (req, res) {
   
    if (req.body.contrasena != req.body.confirm_pwd) {
        res.render("usuarios/create", {
            errors: {
                confirm_pwd: {
                        message:"Las contraseñas no coinciden"
                        
                }
            },
            usuario: new Usuario({
                nombre: req.body.nombre,
                email: req.body.email
            })
        })
    }

    Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        contrasena: req.body.contrasena
    }, function (err, nuevoUsuario) {
        if (err) {
            console.log(err)
            res.render("usuarios/create", {
                errors: err.errors,
                usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email
                })
            });

        }
        else{
            nuevoUsuario.enviar_email_bienvenida();
            res.redirect("/usuarios");
        }
    })
};


exports.delete = function(req,res,next){
    Usuario.findByIdAndDelete(req.body.id,function(err){
        err? next(err): res.redirect("/usuarios");

    })
}

exports.usuario_reservar = function (req, res) {
    Usuario.findById(req.body.id, function (err, r_usuario) {
        console.log(r_usuario);
        r_usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function (err, reserva) {
            console.log("reserva!!");

            res.status(200).json({
                reserva: reserva,
                mensaje: "Creado correctamente"
            });
        })
    })
}