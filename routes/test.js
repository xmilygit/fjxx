var express = require('express')
var router = express.Router();
var xlstojson=require('xls-to-json');
var path=require('path');
var mongoose=require('mongoose');
var locationcode=require('../model/locationcode');



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

router.get('/test',function(req,res,next){
    
    var xls=path.resolve(__dirname,'../public/学籍信息基础字段.xlsx');
    var jsonf=path.resolve(__dirname,'../public/test.json');
    xlstojson({
        input:xls,
        output:jsonf,
        sheet:'Sheet2'
    },function(err,result){
        if(err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test1',function(req,res,next){
    var xls=path.resolve(__dirname,'../public/行政区划.xlsx');
    var jsonf=path.resolve(__dirname,'../public/locationcode.json');
    xlstojson({
        input:xls,
        output:jsonf,
        sheet:'Sheet1'
    },function(err,result){
        if(err)
            console.error(err);
        else
            console.log(result);
    })
    res.end();
})

router.get('/test2',function(req,res,next){
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

module.exports = router;