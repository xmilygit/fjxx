var express = require('express');
//var sql = require('mssql');
var moment = require('moment');
var async = require('async')
var request = require('request');
var db = require('../model/MyDBHelper')
var router = express.Router();

var dbconfig = {
    user: 'sa',
    password: '19810921xmily',
    server: 'fjxx.vicp.net',
    database: 'schoolwx',
    options: {
        tdsVersion: '7_1'
    }
}

var myauth = {
    appid: 'wxba8db6584881bbab',
    appsecret: '7d234a1b76eb803e6683d3a8945985bb',
    token: 'xmilyhh'
};

router.get('/testzs', function (req, res, next) {
    /*
    let a1=setTimeout(function(){
        res.write('阻塞执行完成')        
    },5000);
    */
    sleep(10000);
    res.end();
})
function sleep(milliSeconds) {
    var startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
};

router.get('/testbzs', function (req, res, next) {
    res.write('不阻塞执行完成');
    res.end();
})

router.get('/testclass', function (req, res, next) {
    db.config = dbconfig;
    let sqlstr = 'select count(*) from graduate';
    async.series([
        function (callback) {
            db.execsqlAsync(callback, sqlstr, "test sql", false);
        }
    ], function (err, result) {
        console.log(result[0]);
        res.end();
    })
    //console.log(tc.add()+"===="+testclass.add2())
    //res.end();
})
router.get('/', function (req, res, next) {
    if (req.session.openid) {
        console.log('session is hav')
        
    } else {
        console.log('session is null writer abcd')
        req.session.openid = 'abcd'
    }
    res.render('graduate/index', {
        title: '桂林市凤集小学--毕业生信息管理系统',
        layout: 'f7layouts',
        useropenid: req.session.openid,
    })
    /*
    let code = req.query['code'];
    if (req.session.openid) {
        console.log('session has openid')
        res.render('graduate/index', {
            title: '桂林市凤集小学--毕业生信息管理系统',
            layout: 'f7layouts',
            useropenid: req.session.openid,
            code: 'code is null'
        })
    } else {
        console.log('session is null');
        console.log('code:' + code)
        if (code == null) {
            res.render('graduate/index', {
                title: '桂林市凤集小学--毕业生信息管理系统',
                layout: 'f7layouts',
                useropenid: '111111111111111111',
                code: 'code is null'
            })
        } else {
            async.series([
                function (callback) {
                    fun.getUseOpenId(code, callback);
                }
            ], function (error, result) {
                if (result[0] != "error") {
                    req.session.openid = result[0];
                    res.render('graduate/index', {
                        title: '桂林市凤集小学--毕业生信息管理系统',
                        layout: 'f7layouts',
                        useropenid: result[0],
                        code: code
                    });
                } else {
                    console.log(error)
                }
            })
        }
    }
    */
})

var fun = {
    "getUseOpenId": function (code, callback) {
        //async.series([
        //function (callback) {
        let url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + myauth.appid + "&secret=" + myauth.appsecret + "&code=" + code + "&grant_type=authorization_code "
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log('打印结果：' + JSON.parse(body).openid) 
                //console.log(body)                    
                callback(null, JSON.parse(body).openid);
            } else {
                console.log("获取useropenid时出错：" + error)
                callback(null, "error");
            }
        })
        //}
        //], function (err, result) {
        //    if (result[0] != "error")
        //        return result[0];
        //})

    }
}


module.exports = router;