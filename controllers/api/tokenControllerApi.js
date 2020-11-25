const Usuario = require("../../models/usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports={
    authenticate: function(req,res,next){
        Usuario.findOne({email:req.body.email} ,function (err,userInfo) {
            if (err){ next(err)}
            else {
                if(userInfo == null ){ return res.status(401).json({status:"error",message:"credenciales inválidas", data:null});}
                if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.contrasena)){
                 
                        const token = jwt.sign({id:userInfo._id},req.app.get("secretKey"),{expiresIn:"7d"});
                        res.status(200).json({message:"usuario encontrado",data:{usuario:userInfo,token:token}});
                    
                }else{
                    res.status(401).json({status:"error",message:"credenciales incorrectas",data:null})
                }
            }
        });
    },

    forgotPassword: function(req,res,next){
        Usuario.findOne({ email:req.body.email },function(err,usuario){
            if(!usuario ) return res.status(404).json({message:"NO existe el correo",data:null});
            usuario.resetPassword(function(err){
                if (err){ return next(err);}
                res.status(200).json({message:"Se ha enviado un email para recuperar el password",data:null})
            })
        } )
    }
}

