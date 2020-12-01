require("dotenv").config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require("./config/passport")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const jwt = require("jsonwebtoken")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var biciRouter = require('./routes/bicicletas');
var biciAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require("./routes/api/usuarios")
var authAPIRouter = require("./routes/api/auth")
var tokenRouter = require("./routes/token")
var {restore_pass, update_pass} = require("./controllers/usuarios")

let store 
if(process.env.NODE_ENV === "development"){
  store = new session.MemoryStore
}
else{
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collenction: "sessions"
  })
  store.on("error", function(err){
    assert.ifError(error)
    assert.ok(false)
  })
}

var app = express();
// app.set("secretKey", "asdfkjeiwfslkj")

const dias = 10;
app.use(
  session({
    cookie: {maxAge: dias*24*60*60*1000},
    store: store,
    saveOptionalized: true,
    resave: "true",
    secret: "red_bicisasdfasdf"
  })
)

var mongoose = require("mongoose");
const { assert } = require("console");
//"mongodb://localhost/red-bicicletas";
var mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.get("/login", function(req, res){
  res.render("session/login")
})

app.post("/login", function(req,res,next){
  passport.authenticate("local", function(err, usuario, info){
    // if(err) return next(err)
    if(!usuario) return res.render("session/login", {info})
    req.logIn(usuario, function(err){
      if(err) return next(err)
      return res.render("index", {usuario: usuario})
    })
  })(req, res, next)
})
app.get("/logout", function(req, res){
  req.logout()
  res.redirect("/")
})
app.get("/forgotPassword", function(req,res){
  res.render("session/forgotPassword")
})

app.post("/forgotPassword", restore_pass)
app.post("/resetPassword", update_pass)

app.use("/privacy_policy", function(err, res){
  res.render("privacy_policy")
})
app.use("/google8a493e4c70e3e872", function(err, res){
  res.sendFile(__dirname + "/public/google8a493e4c70e3e872.html")
})

app.use("/auth/google", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.profile.emails.read",
    "https://www.googleapis.com/auth/user.emails.read",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ]
}))

app.use("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/error"
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/token", tokenRouter)

app.use('/bicicletas', loggedIn, biciRouter); // middleware

app.use("/api/auth", authAPIRouter)
app.use('/api/bicicletas', validarUsuario, biciAPIRouter);
app.use('/api/usuarios', validarUsuario, usuariosAPIRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err//process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next){
  if(req.user){
    next()
  }
  else{
    console.log("user sin loguearse")
    res.redirect("/login")
  }
}

function validarUsuario(req, res, next){
  console.log(req.headers.token)
  if(req.headers.token){
    passport.deserializeUser(req.headers.token, function(err, user){
      if(user) next()
    })
  }
  else
  jwt.verify(req.headers["x-access-token"], process.env.JWT_KEY, function(err, decoded){
    if(err){
      res.json({status: "error", message: err.message, data: null})
    }
    else{
      req.body.userId = decoded.id
      console.log("jwt verify: " + decoded)
      next()
    }
  })
}

module.exports = app;
