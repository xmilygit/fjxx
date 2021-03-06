var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var localstrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var crypto = require('crypto');
var xmlparser = require('express-xml-bodyparser');

var db = require('./model/db');
var Account = require('./model/Account');
var StudentInfo = require('./model/StudentInfo');
var temp = require('./model/tempModel');
var stu2018=require('./model/stu2018');
var admin = require('./routes/admin/main');
var StuInfoInput = require('./routes/wechat/stuinfoinput')
var rootsite = require('./routes/root');
var Accounts = require('./routes/Account');
var Library = require('./routes/library');
var rootWechat = require('./routes/rootWechat');
var graduate = require('./routes/wechat/graduate');
var wcBinder = require('./routes/wechat/binder')
var wcIndex = require('./routes/wechat/index');
var test = require('./routes/test');

var app = express();



//设置passport相关设置
var ppls = new localstrategy(
    function(username, password, done) {
        //读取对应username/password符合的数据库记录

        let sha1 = crypto.createHash('sha1');
        sha1.update(password);
        mongoose.model('Account').find({ 'username': username, 'password': sha1.digest('hex') }, function(err, user) {
            if (err) {
                return done(null, false, { message: '获取数据出错！' + err.message });
            } else {
                if (user.length <= 0) {
                    return done(null, false, { message: '请检查用户名及密码是否正确！' });
                }
                done(null, user);
            }
        });
    }
)
passport.use('local', ppls);
//设置flash相关的配置
var h = 3600000 * 3;
app.use(session({
    secret: 'xljx',
    //key: 'cookieName',
    name: 'usersession',
    cookie: { maxAge: h },
    resave: false,
    saveUninitialized: true
}));

app.use(flash())

app.use(function(req, res, next) {
    res.locals.error = req.flash('error');
    next();
});

var hbs = exphbs.create({
    layoutsDir: 'views/layouts',
    defaultLayout: 'f7layouts',
    extname: '.html',
    helpers: {
        foo: function() { return 'FOO!'; },
        bar: function() { return 'BAR!'; },
        wechatimgurl: function(val) {
            //return val.replace('http://mmbiz.qpic.cn', 'http://read.HTML5.qq.com/image?src=forum&q=5&r=0&imgflag=7&imageUrl=http://mmbiz.qpic.cn');
            return val;
        }
    }
})

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('.html', hbs.engine);
app.set('view engine', '.html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(xmlparser());
app.use(express.static(path.join(__dirname, 'public')));
//将passport加入进中间件
app.use(passport.initialize());
app.use(passport.session());
app.use('/Account', Accounts);
app.use('/', rootsite);
app.use('/Library', Library);
//微信接入总入口
app.use('/wechat', rootWechat);
//微信绑定功能入口
app.use('/wechat/binder', wcBinder);
//微信默认首页
app.use('/wechat/ui', wcIndex);
//微信新生学籍信息补充功能入口
app.use('/wechat/stuinfo', StuInfoInput);
//微信毕业生信息补充功能入口 
app.use('/wechat/graduate', graduate);
app.use('/test', test);
//web端管理功能入口
app.use('/main', admin);





passport.serializeUser(function(user, done) {
    console.log(user);
    console.log(user[0].id);
    done(null, user[0].id);
})

passport.deserializeUser(function(id, done) {
    mongoose.model("Account").findById(id, function(err, user) {
        done(err, user);
    })
})



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