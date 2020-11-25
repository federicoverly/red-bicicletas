const Token = require("../models/Token")
const Usuario = require("../models/usuario")

module.exports = {
    confirmationToken: function(req,res,next){
        Token.findOne({token:req.params.token},function(err,token){
            if (!token){ return res.status(404).send({type:"not-verified",msg:"No se encontraron usuarios con este token puede que haya expirado y deba soliitar otro"})};
            Usuario.findById(token._usuarioId,function(err,usuario){
                if (!usuario) return res.status(404).send({msg:"No encontramos un usuario con este token de verificacion"})
                if (usuario.verificado) return res.redirect("/usuarios")
                usuario.verificado= true;
                usuario.save(function(err){
                    if (err){return res.status(500).send({msg:err.message});}
                    res.redirect("/")
                })
            })
        })
    }
}