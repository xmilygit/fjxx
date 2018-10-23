var express = require('express')
var router = express.Router();
var xlstojson = require('xls-to-json');
var path = require('path');
var mongoose = require('mongoose');
var crypto = require('crypto');
var locationcode = require('../model/locationcode');


function strtomd5(str) {
    var sha1 = crypto.createHash('sha1')
    sha1.update(str);
    return sha1.digest('hex');
}
router.get('/testjssdk', function(req, res, next) {
    res.render('test', {
        title: '测试页面',
        layout: 'f7layoutsbase'
    })
})
router.get('/setstudentpasswordbat', function(req, res, next) {
        //mongoose.model('Account').find({ infoid: { $ne: null } }, function (err, docs) {
        //mongoose.model('Account').find({ _id: { $gt: '59860ba9bc1d5059d9b96a48' } }, function (err, docs) {
        //mongoose.model('Account').find({ _id: { $gte: '5ac24b5389c40a4dc997058b' } }, function(err, docs) {
          mongoose.model('Account').find({ _id: { $gte: '5bcd778e494da82690dd7f23' } }, function(err, docs) {
            docs.forEach(function(v, i, docs) {

                if (v.pid != "") {
                    //console.log(v.username + "===" + strtomd5(v.pid.substr(12, 6)));
                    v.password = strtomd5(v.pid.substr(12, 6));
                    v.save();
                }

                //console.log(v.username);
            })

            //console.log(docs)
            res.end();
        })
    })
    /*
    var sql = require('mssql');
    var moment = require('moment');
    var Sequelize = require('sequelize');

    var config = {
        user: 'sa',
        password: '19810921xmily',
        server: 'fjxx.vicp.net',
        database: 'tsdata',
        options: {
            tdsVersion: '7_1'
        }
    }

    var sequelize = new Sequelize(config.database, config.user, config.password, {
        host: config.server,
        dialect: 'mssql',
        define:{schema:'dbo'},
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
    });

    var User = sequelize.define('user', {
        firstName: {
            type: Sequelize.STRING,
            field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
        },
        lastName: {
            type: Sequelize.STRING
        }
    }, {
            freezeTableName: true // Model tableName will be the same as the model name
        });



    router.get('/test', function (req, res, next) {
        User.sync({ force: true }).then(function () {
            res.json(User.create({ firstName: 'John', lastName: 'Hancock' }))
        }).catch(function(err){
            res.json({error:err});
        })

    })

    */

router.get('/test', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/append.xlsx');
    var jsonf = path.resolve(__dirname, '../public/test.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: 'studentinfo'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test1', function(req, res, next) {
    var xls = path.resolve(__dirname, '../public/行政区划.xlsx');
    var jsonf = path.resolve(__dirname, '../public/locationcode.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: 'Sheet1'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test2', function(req, res, next) {
    /*
    mongoose.model("StudentInfo").find({})
    .limit(10)
    .exec(function(err,result){
        if(err){
            console.error(err);
            return;
        }
        console.log(result);
        res.end()
    })
    */
    console.log(locationcode)

})

router.get('/test3', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/6ginfo.xlsx');
    var jsonf = path.resolve(__dirname, '../public/6ginfo.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: 'studentinfo'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test4', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/2012.xlsx');
    var jsonf = path.resolve(__dirname, '../public/2012.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: '1'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test5', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/xsxx.xlsx');
    var jsonf = path.resolve(__dirname, '../public/xsxx.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: '1'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})


router.get('/test6', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/工作簿1.xlsx');
    var jsonf = path.resolve(__dirname, '../public/gzb.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: '备注版原始版'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test7', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/2017graduate.xlsx');
    var jsonf = path.resolve(__dirname, '../public/2017.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: '附表2'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test8', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/副本分班.xlsx');
    var jsonf = path.resolve(__dirname, '../public/2018.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: 'json'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test9', function(req, res, next) {

    var xls = path.resolve(__dirname, '../public/基本信息app版.xlsx');
    var jsonf = path.resolve(__dirname, '../public/2018info.json');
    xlstojson({
        input: xls,
        output: jsonf,
        sheet: '学籍信息'
    }, function(err, result) {
        if (err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/testreg', function(req, res, next) {
    var pattern = /叠彩/g;
    var stu1=[];
    var stu2=[];
    var stu3=[];


    mongoose.model('temp').find({}, function(err, docs) {
        if (err) {
            console(err)
            res.end();
            return;
        }
        docs.forEach(function(v, i, docs) {
            if (/桂林|叠彩|七星|秀峰|象山/g.test(v.户口所在地)&&!/临桂|雁山/g.test(v.户口所在地)) {
                if (/村|组|队|乡|屯/g.test(v.户口所在地)) {
                    stu2.push(v.姓名+"["+v.户口所在地+"]");
                    //console.log(v.姓名 + '[' + v.户口所在地 + ']')
                }else{
                    stu1.push(v.姓名+"["+v.户口所在地+"]");
                }
            }else{
                stu3.push(v.姓名+"["+v.户口所在地+"]");
            }
        });
        console.log("共" + docs.length + "其中四城区户籍" + stu1.length + "人");
        console.log(stu1);
        console.log("共" + docs.length + "其中桂林市郊区户籍" + stu2.length + "人");
        console.log(stu2);
        console.log("共" + docs.length + "其中外来户籍" + stu3.length + "人");
        console.log(stu3);
        res.setHeader('content-type','text/html; charset=UTF-8');
        stu1.forEach(function(s,i,ss){
            res.write(s+"</br>");
        })
        res.write("================================</br>")
        stu2.forEach(function(s,i,ss){
            res.write(s+"</br>");
        })
        res.write("================================</br>")
        stu3.forEach(function(s,i,ss){
            res.write(s+"</br>");
        })
        res.end();
        
    })


    //var t1 = '叠彩区中山北路133号44座202室';
    //console.log(/叠彩/g.test(t1));
})



module.exports = router;