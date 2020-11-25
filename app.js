var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var Usuario = require("./models/usuario")
var Token = require("./models/Token")
const passport = require("./config/passport");
const session = require("express-session");

var indexRouter = require('./routes/index');
var UsuarioRouter = require('./routes/usuario');
var bicicletasRouter = require('./routes/bicicleta');
var bicicletasAPIRouter = require('./routes/api/bicicleta');
var UsuarioAPIRouter = require('./routes/api/usuario');
var TokenRouter =require("./routes/token");
var AuthController = require("./routes/api/auth");

const jwt = require("jsonwebtoken");


const store = new session.MemoryStore;

var app = express();


// only for test remove this for production

Usuario.findOne({email:"test@test.com",nombre:"test_validation"},function(err,user){
  if (!user) {Usuario.create({email:"test@test.com",nombre:"test_validation",contrasena:"test"},function(err,usuario){
    console.log("usuario test creado") 
  })}
})


app.use(session({
  cookie: {maxAge:240*60*60*1000},
  store:store,
  saveUninitialized: true,
  resave:"true",
  secret:"semilla_bicicletas!##$%!)"
}));

app.set("secretKey","jwt_pwd_!!#$$");
var mongoose = require("mongoose");

var mongooseDB= 'mongodb://localhost/red_bicicletas';

mongoose.connect(mongooseDB,{useNewUrlParser:true, useUnifiedTopology: true });
mongoose.Promise= global.Promise;
var db = mongoose.connection;
db.on('error',console.error.bind(console,"MONGODB connection error"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/usuarios', UsuarioRouter);
app.use('/bicicletas', loggedIn,bicicletasRouter);
app.use('/api/bicicletas',validarUsuario, bicicletasAPIRouter);
app.use('/api/usuarios', UsuarioAPIRouter);
app.use('/token', TokenRouter);
app.use("/api/auth",AuthController)

app.get("/login",function(req,res,next){
  res.redirect("/");
})

app.post('/login', function(req, res, next) {
  console.log(req.body)
  passport.authenticate('local', function(err, user, info) {
    
    if (err) { return next(err); }
    if (!user) { return res.render('index',{usuario:{email:req.body.email},errors:info }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/bicicletas');
    });
  })(req, res, next);
});


app.get("/logout",function(req,res){
  //res.send("Hola")
  req.logout();
  res.redirect("/");
});

app.get("/forgotPassword",function(req,res){
  res.render("session/forgotPassword")
});



app.post("/forgotPassword",function(req,res){
  Usuario.findOne({email:req.body.email},function(err,usuario){
    if(!usuario) return res.render("session/forgotPassword",{info:{message:"No se encontro este correo"}});

    usuario.resetPassword(function(err){
      console.log(err)
      if(err) return next(err);
    })
    res.render("session/forgotPasswordMessage")
  })
});

app.get("/resetPassword/:token",function(req,res){
  Token.findOne({token:req.params.token},function(err,token){
    if(!token) return res.status(404).send({type:"not-verfied",msg:"NO existe o expiró este token"});
    Usuario.findById(token._usuarioId,function(err,usuario){
      if (!usuario) return res.status(400).send({msg:"El usuario ya no existe"})
      res.render("session/resetPassword",{errors:{},usuario:usuario,token:token.token})
    })
  })
});

app.post("/resetPassword",function(req,res){
  if (req.body.password != req.body.confirm_pwd){
    res.render("session/resetPassword",{errors:{confirm_pwd:"las contraseñas no coinciden"}})
    return;
  }

  Token.findOne({token:req.body.token},function(err,token){
    if(!token) return res.status(404).send({type:"not-verfied",msg:"No existe o expiró este token"});
    Usuario.findOne({email:req.body.email, _id:token._usuarioId},function(err,usuario){
      if (!usuario) return res.status(400).send({msg:"El usuario ya no existe"})
      usuario.contrasena= req.body.password
      usuario.save().then(()=>{
        res.redirect("/")
      }).catch((err)=>{
        console.log(err)
      })
    })
  });  
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function loggedIn(req,res,next){
  if(req.user){
    next();
  }else{
    console.log("usuario sin logearse");
    res.redirect('/');
  }
}

function validarUsuario(req,res,next){
  jwt.verify(req.headers["x-acces-token"],req.app.get("secretKey"),function(err,decoded){
    if(err){
      res.json({status:"error",message:err.message,data:null});
    }else{
      req.body.userId= decoded.id;
      console.log("jwt verify: "+decoded);
      next();
    }
  })
}


module.exports = app;
