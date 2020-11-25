var mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const mongoose_unique_validator = require("mongoose-unique-validator");
const saltMounds = 10;
const crypto = require("crypto");
var  mailer = require("../controllers/mailer/mailer");


const Reserva = require('./reserva');
const  Token  = require('../models/Token');


var Schema = mongoose.Schema;

const validateEmail =  function(email){
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return re.test(email)
}
// Declare the Schema of the Mongo model
var UsuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true,"El nombre es oblogatorio"],
        unique: true,
        index: true,
    },

    email: {
        type: String,
        required: [true,"EL email es obligatorio"],
        unique: true,
        lowercase: true,
        validate:[validateEmail,"El email no es valido"],
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g]
    },
    contrasena: {
        type: String,
        required: true,
    },
    
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado:{
        type:Boolean,
        default:false
    }

});

UsuarioSchema.pre("save",function(next){
    if(this.isModified('contrasena')){
        this.contrasena =bcrypt.hashSync(this.contrasena,saltMounds);
    }
    next();
});

UsuarioSchema.methods.verifyPassword=function(contrasena){
    return bcrypt.compareSync(contrasena,this.contrasena);
}

UsuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    var reserva  = new Reserva({
        usuario: this._id,
        bicicleta: biciId,
        desde: desde,
        hasta: hasta
    });
    console.log(reserva);
    reserva.save(cb);
}


UsuarioSchema.methods.enviar_email_bienvenida = function(cb){
    const token = new Token({_usuarioId:this.id,token:crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if (err){ return console.log(err.message);}
        const mailOptions={
            from :"no-reply alguien.com",
            to: email_destination,
            subject:"verificacion de cuenta",
            text:"Hola \n\n"+"Por favor para verificar tu cuenta accede a \n"+"http://localhost:3000/token/confirmation/"+token.token+".\n"
        }

        mailer.sendEmail(mailOptions).catch((err_mail)=> console.log(err_mail));
        console.log("se envio un correo de confirmacion a "+ email_destination)

        
    })
}



UsuarioSchema.methods.resetPassword = function(cb){
    const token = new Token({_usuarioId:this.id,token:crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function(err){
        if (err){ return console.log(err.message);}
        const mailOptions={
            from :"no-reply alguien.com",
            to: email_destination,
            subject:"Recuperacion de contraseña",
            text:"Hola \n\n"+"Por favor para cambiar su contraseña haga clik  aqui \n"+"http://localhost:3000/resetPassword/"+token.token
        }

        mailer.sendEmail(mailOptions).catch((err_mail)=> console.log(err_mail));
        console.log("se envio un correo de confirmacion a "+ email_destination)

        
    })
}

//Export the model

UsuarioSchema.plugin(mongoose_unique_validator,{ message:'EL {PATH} ya existe con otro usuario'})

module.exports = mongoose.model('Usuario', UsuarioSchema);