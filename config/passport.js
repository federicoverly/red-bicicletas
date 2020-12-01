const passport = require("passport")
// const { deleteOne } = require("../models/usuario")
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FacebookTokenStrategy = require("passport-facebook-token")
const Usuario = require("../models/usuario")
 
passport.use(new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password"
  },
  function(email, password, done){
    Usuario.findOne({email: email}, function(err, usuario){
      if(err) return done(err)
      if(!usuario) return done(null, false, {message: "Email inexistente"})
      if(!usuario.validPassword(password)) return done(null, false, {message: "Password incorrecto"})
      if(!usuario.verificado) return done(null, false, {message: "Debe activar la cuenta"})
      // revisar si el email está verificado
      return done(null, usuario)
    })
  }
))

passport.use(new FacebookTokenStrategy(
  {
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
  },
  function(accessToken, refreshToken, profile, done){
    try {
      Usuario.findOneOrCreateByFacebook(profile, function(err, user){
        if(err){
          console.log("err: " + err)
        }
        return done(err, user)
      }) 
    }
    catch(err2){
      console.log(err2)
      return done(err2, null)
    }
  }
))

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback",
    includeEmail: true
  },
  function(accessToken, refreshToken, profile, cb){
    Usuario.findOneOrCreateByGoogle(profile, function(err, user){
      return cb(err, user)
    })
  }
))

passport.serializeUser(function(user, cb){
  cb(null, user.id)
})

passport.deserializeUser(function(id, cb){
  Usuario.findById(id, function(err, usuario){
    cb(err, usuario)
  })
})

module.exports = passport