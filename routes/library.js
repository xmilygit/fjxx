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
router.get('/test',function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({type:"error",message:"aaaaaaaa"});
})
router.get('/txm', function (req, res, next) {
    sql.connect(config).then(function () {
        console.log('mssql连接成功');
        let sqlreq = new sql.Request();
        sqlreq.input('txm', sql.Char, req.query['txm']);
        sqlreq.query('select * from ts where txm=@txm').then(function (recordset) {
            console.log(recordset);
            res.json(recordset);
            //res.end(json(recordset));
        }).catch(function (err) {
            console.log(err);
        })
    }).catch(function (err) {
        console.log('数据连接出错：' + err);
    })
})

router.post('/unreturnBook', function (req, res, next) {
    let currentpage=parseInt(req.body.currentpage)-1;
    let pagesize = parseInt(req.body.pagesize);
    //let pagenum = parseInt(req.body.pagenum);
    let beginnum = parseInt(pagesize * currentpage);
    let endnum=beginnum+pagesize;
    let keyword = req.body.keyword;
    let daterange1 = req.body.daterange.substring(0, 10).replace(/-/g, '');
    let daterange2 = req.body.daterange.substring(13, 23).replace(/-/g, '');
    //console.log(daterange1+"***"+daterange2);
    res.setHeader("Access-Control-Allow-Origin", "*");
    sql.connect(config).then(function () {
        console.log('mssql连接成功，正在处理未还书数据');
        if (daterange1.trim().length <= 0) {
            let sqlstr="with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0 and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')) select top " + pagesize + " * from temp where id between " + beginnum + " and " + endnum
            new sql.Request()
                .query(sqlstr).then(function (recordset) {
                    console.log('成功获得数据');
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("获取数据失败：" + err);
                    res.json({ type: 'error', message: '获取数据失败：' + err });
                })
        } else {
            let sqlstr="with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0 and hnyr>='" + daterange1 + "' and hnyr<='" + daterange2 + "' and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')) select top " + pagesize + " * from temp where id between " + beginnum + " and " + endnum;
            console.log(sqlstr)
            new sql.Request()
                .query(sqlstr).then(function (recordset) {
                    console.log('成功获得数据');
                    res.json(recordset);
                }).catch(function (err) {
                    console.log("获取数据失败：" + err);
                    res.json({ type: 'error', message: '获取数据失败：' + err });
                })

        }
    }).catch(function (err) {
        console.log('数据库连接出错：' + err)
        res.json({ type: 'error', message: '数据库连接出错：' + err });
    })
})


router.get('/', function (req, res, next) {
    sql.connect(config).then(function () {
        console.log('mssql连接成功');
        new sql.Request()
            //.input('topnum',sql.Int,req.query["topnum"])
            .query('select top ' + req.query["topnum"] + ' * from ts order by txm desc').then(function (recordset) {
                console.log(recordset);
            }).catch(function (err) {
                console.log(err);
            })

    }).catch(function (err) {
        console.log(err);
    })
    res.render('Library/index', { title: '图书', qm: 'aaaaaaa' });
})

module.exports = router;


//with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0 and hnyr>='' and hnyr<='' and (dzxm like '%%' or sm like '%%')))
//select top 10 * from temp where id between 230 and 240