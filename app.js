var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs=require('express-handlebars');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var localstrategy=require('passport-local').Strategy;
var mongoose=require('mongoose');
var crypto=require('crypto');

var db=require('./model/db');
var Account=require('./model/Account');
var rootsite=require('./routes/root');
var Accounts = require('./routes/Account');

var app = express();

//设置passport相关设置
var ppls=new localstrategy(
  function(username,password,done){
    //读取对应username/password符合的数据库记录
    let sha1=crypto.createHash('sha1');
    sha1.update(password);
    var user=mongoose.model('Account').find({'name':username,'password':sha1.digest('hex')});
    console.log(user);
    if(user==null){
      return done(null,false,{message:'请检查用户名及密码是否正确!'});
    };
    done(null,user);
  }
)
passport.use('local',ppls);
//设置flash相关的配置
app.use(session({
  secret:'xljx',
  key:'cookieName',
  cookie:{maxAge:60000},
  resave:false,
  saveUninitialized:true
}));

app.use(flash())

app.use(function(req,res,next){
  res.locals.error=req.flash('error');
  next();
});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('.fjxx',exphbs({
  layoutsDir:'views/layouts',
  defaultLayout:'commlayouts',
  extname:'.fjxx'
}))
app.set('view engine', '.fjxx');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//将passport加入进中间件
app.use(passport.initialize());
app.use('/Account', Accounts);
app.use('/',rootsite);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
