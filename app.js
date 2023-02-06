var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var moment = require('moment');
var md5 = require('md5');
var passport = require('passport');
const MongoStore = require('connect-mongo');
var ReverseMd5 = require('reverse-md5')


global.__base = __dirname + '/';
global.__path_routes      = __base + 'routes/';
global.__path_configs     = __base + 'configs/';
global.__path_schemas     = __base + 'schemas/';
global.__path_helpers     = __base + 'helpers/';
global.__path_views       = __base + 'views/';
global.__path_validates   = __base + 'validates/';
global.__path_models      = __base + 'models/';
global.__path_public      = __base + 'public/';
global.__path_middleware  = __base + 'middleware/';

global.__path_view_backend  = __path_views + 'backend/';
global.__path_view_frontend = __path_views + 'frontend/';
global.__path_upload        = __path_public + 'upload/';

const systemConfig = require(__path_configs+'system');
const databaseConfig = require(__path_configs + 'database');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __path_view_backend + 'backend');

app.use(session({
  ookie: { maxAge: 14*24*3600*1000 }, 
  secret: 'fahasa',
  resave: false, 
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: `mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.f7nef.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`,})
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(flash());
app.use( (req, res, next) => {
  res.locals.messages = req.flash();
  next();
});


require(__path_configs + 'passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Local variable
app.locals.systemConfig = systemConfig;
app.locals.moment = moment;
app.locals.md5 = md5;
app.locals.ReverseMd5 = ReverseMd5({
  lettersUpper: false,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 12
})


// Setup router

const UserInfoMiddleware  = require(__path_middleware + 'get-user-info');
const verticalMiddleware	= require(__path_middleware + 'vertical-menu');
const countCartMiddleware	= require(__path_middleware + 'get-count-cart');
const errLogin	          = require(__path_middleware + 'err-login');

app.use(`/${systemConfig.prefixAdmin}`, require(__path_routes + 'backend/index'));
app.use(`/${systemConfig.prefixFrontend}`, errLogin, countCartMiddleware, UserInfoMiddleware, verticalMiddleware, require(__path_routes  + 'frontend/index'));

//Connect database
mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@cluster0.f7nef.mongodb.net/${databaseConfig.database}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
    //Check connect
var db = mongoose.connection;
db.on('error', () => {
  console.log('connection error');
});
db.once('open', () => {
  console.log('connected');
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

  if(systemConfig.env == 'dev'){
    res.render(__path_view_backend + 'error');
  }
  if(systemConfig.env == 'production'){
    let layoutFrontend 	= __path_view_frontend + 'frontend';
    res.render(__path_view_frontend + 'error', { 
    	title: 'Error' ,
    	layout: layoutFrontend,
    	header_menu: true,
      });
  }
  
});

module.exports = app;
