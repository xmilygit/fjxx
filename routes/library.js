var express = require('express')
var router = express.Router();
var sql = require('mssql');

var config = {
    user: 'sa',
    password: '19810921xmily',
    server: 'fjxx.vicp.net',
    database: 'tsdata',
    options: {
        tdsVersion: '7_1'
    }
}

router.get('/txm',function(req,res,next){
    sql.connect(config).then(function(){
        console.log('mssql连接成功');
        let sqlreq=new sql.Request();
        sqlreq.input('txm',sql.Char,req.query['txm']);
        sqlreq.query('select * from ts where txm=@txm').then(function(recordset){
            console.log(recordset);
            res.json(recordset);
            //res.end(json(recordset));
        }).catch(function(err){
            console.log(err);
        })
    }).catch(function(err){
        console.log('数据连接出错：'+err);
    })
})

router.post('/unreturnBook',function(req,res,next){
    console.log(req["pagesize"]+"==="+req["pagenum"]+"==="+req["keyword"]+"==="+req["datarang"]);
    res.end();
})


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


//with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0)
//select top 10 * from temp where id between 230 and 240