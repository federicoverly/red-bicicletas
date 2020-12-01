var mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
var Reserva = require("./reserva")
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt")
const saltRounds = 10
const crypto = require("crypto")
const mailer = require("../mailer/mailer")
const Token = require("./token")

const validateEmail = function(email){
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})*$/
  return re.test(email)
}
var usuarioSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"]
  },
  email: {
    type: String,
    trim: true,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    unique: true,
    validate: [validateEmail, "Ingrese un email válido."],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})*$/]
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio."],
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  verificado: {
    type: Boolean,
    default: false
  },
  googleID: String,
  facebookID: String
})

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'})

usuarioSchema.pre("save", function(next){
  if(this.isModified("password")){
    this.password = bcrypt.hashSync(this.password, saltRounds)
  }
  next()
})

usuarioSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
  var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
  reserva.save(cb)
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
  const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString("hex")})
  const email_destination = this.email
  token.save(function(err){
    if(err){
      return console.log(err.message)
    }
    else{
      const mailOptions = {
        from: "nachomilia91@hotmail.com",
        to: email_destination,
        subject: "Verificacion",
        text: `activar: http://localhost:${process.env.PORT}/token/confirmation/${token.token}`
      }
      mailer.sendMail(mailOptions, function(err){
        if(err){
          return console.log(err.message)
        }
        console.log("Mail de activación enviado")
      })
    }
  })
}

usuarioSchema.methods.enviar_email_recuperacion = function(cb){
  const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString("hex")})
  const email_destination = this.email
  token.save(function(err){
    if(err){
      return console.log(err.message)
    }
    else{
      const mailOptions = {
        from: "nachomilia91@hotmail.com",
        to: email_destination,
        subject: "Recuperación de contraseña",
        html: `Ingrese al siguiente enlace para recuperar su contraseña: <a href="http://localhost:${process.env.PORT}/token/resetPassword/${token.token}" target="_blank">http://localhost:3000/token/resetPassword/${token.token}</a>`
      }
      mailer.sendMail(mailOptions, function(err){
        if(err){
          return console.log(err.message)
        }
        console.log("Mail de recuperación de contraseña enviado")
      })
    }
  })
}

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneoOrCreate(condition, callback){
  const self = this;
  self.findOne(
    {$or:[
      {"googleID": condition.id}
      , {"email": condition.emails[0].value}
    ]}
    ,
  (err, result) => {
    console.log("ERR: "+err)
    if(result){
      callback(err, result)
    }
    else{
      console.log("--CONDITION--")
      console.log(condition)
      let values = {}
      values.googleID = condition.id
      values.email = condition.emails[0].value
      values.nombre = condition.displayName || "SIN NOMBRE"
      values.verificado = true
      values.password = condition.id + "123"
      console.log("--VALUES--")
      console.log(values)
      self.create(values, (err, result) => {
        if(err) console.log(err)
        return callback(err, result)
      })
    }
  }
  )
}

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneoOrCreate(condition, callback){
  const self = this;
  console.log("...............................................................................................................................")
  self.findOne(
    {$or:[
      {"facebookID": condition.id},
      {"email": condition.emails[0].value}
    ]}
    ,
  (err, result) => {
    if(err) console.log("ERROR::::::::::::::: "+err)
    if(result){
      callback(err, result)
    }
    else{
      console.log("--CONDITION--")
      console.log(condition)
      let values = {}
      values.facebookID = condition.id
      values.email = condition.emails[0].value
      values.nombre = condition.displayName || "SIN NOMBRE"
      values.verificado = true
      values.password = crypto.randomBytes(16).toString("hex")
      console.log("--VALUES--")
      console.log(values)
      self.create(values, (err, result) => {
        if(err) console.log(err)
        return callback(err, result)
      })
    }
  }
  )
}

// EXPORT

module.exports = mongoose.model("Usuario", usuarioSchema)