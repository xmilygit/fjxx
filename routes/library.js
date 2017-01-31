var express = require('express')
var router = express.Router();
var sql = require('mssql');

var config = {
    user: 'sa',
    password: '',
    server: 'fjxx.vicp.net',
    database: 'tsdata',
    options: {
        tdsVersion: '7_1'
    }
}

router.get('/', function (req, res, next) {
    sql.connect(config).then(function () {
        console.log('mssql连接成功');
        new sql.Request()
        //.input('topnum',sql.Int,req.query["topnum"])
        .query('select top '+req.query["topnum"]+' * from ts order by txm desc').then(function(recordset){
            console.log(recordset);
        }).catch(function(err){
            console.log(err);
        })

    }).catch(function (err) {
        console.log(err);
    })
    res.render('Library/index',{title:'图书',qm:'aaaaaaa'});
})

module.exports=router;