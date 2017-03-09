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
router.get('/test', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({ type: "error", message: "aaaaaaaa" });
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
    let currentpage = parseInt(req.body.currentpage) - 1;
    let pagesize = parseInt(req.body.pagesize);
    let beginnum = parseInt(pagesize * currentpage) + 1
    let endnum = beginnum + pagesize - 1;
    let keyword = req.body.keyword;
    let daterange1 = req.body.daterange.substring(0, 10).replace(/-/g, '');
    let daterange2 = req.body.daterange.substring(13, 23).replace(/-/g, '');

    res.setHeader("Access-Control-Allow-Origin", "*");
    sql.connect(config).then(function () {
        console.log('mssql连接成功，正在处理未还书数据');
        let fun1 = 0, fun2 = 0;
        let result = { type: "", recordset: [], count: 0 };
        let sqlstr = "", sqlstr2 = "";
        if (daterange1.trim().length <= 0) {
            sqlstr = "with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0 and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')) select top " + pagesize + " * from temp where id between " + beginnum + " and " + endnum
            sqlstr2 = " select count(*) as recosum from v_borrow where hsbz=0 and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')"

            new sql.Request()
                .query(sqlstr).then(function (recordset) {
                    console.log('成功获得数据');
                    result.type = "ok";
                    result.recordset = recordset
                    fun1 = 1;
                    if (fun1 + fun2 == 2) {
                        res.json(result)
                    }
                }).catch(function (err) {
                    console.log("获取数据失败：" + err);
                    res.json({ type: 'error', message: '获取数据失败：' + err });
                })
            new sql.Request()
                .query(sqlstr2).then(function (count) {
                    console.log("成功获取数据总数")
                    result.type = "ok";
                    result.count = count[0].recosum;
                    fun2 = 1
                    if (fun1 + fun2 == 2) {
                        res.json(result)
                    }
                }).catch(function (err) {
                    console.log("获取数据总数失败：" + err);
                    res.json({ type: 'error', message: '获取数据总数失败：' + err });
                })
        } else {
            sqlstr = "with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0 and hnyr>='" + daterange1 + "' and hnyr<='" + daterange2 + "' and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')) select top " + pagesize + " * from temp where id between " + beginnum + " and " + endnum;
            sqlstr2 = "select count(*) as recosum from v_borrow where hsbz=0 and hnyr>='" + daterange1 + "' and hnyr<='" + daterange2 + "' and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')"
            new sql.Request()
                .query(sqlstr).then(function (recordset) {
                    console.log('成功获得数据');
                    result.type = "ok";
                    result.recordset = recordset
                    fun1 = 1;
                    if (fun1 + fun2 == 2) {
                        res.json(result)
                    }
                }).catch(function (err) {
                    console.log("获取数据失败：" + err);
                    res.json({ type: 'error', message: '获取数据失败：' + err });
                })
            new sql.Request()
                .query(sqlstr2).then(function (count) {
                    console.log("成功获取数据总数")
                    result.type = "ok";
                    result.count = count[0].recosum;
                    fun2 = 1
                    if (fun1 + fun2 == 2) {
                        res.json(result)
                    }
                }).catch(function (err) {
                    console.log("获取数据总数失败：" + err);
                    res.json({ type: 'error', message: '获取数据总数失败：' + err });
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
/*
藏书利用率：是指在一定的时期(学期、学年)，全部书刊资料被读者利用的数量占全部馆藏的百分比。
计算公式为：（读者利用册数÷馆藏书总册数）×100%  
读者借阅率：是指在一定的时期(学期、学年)，平均每个读者所借的书刊资料数量。
计算公式为：（借阅总册数÷借阅总人数）×100%  
图书流通率：是指在一定的时期(学期、学年)，用于公开借阅的书刊被读者借阅的数量所占的百分比。
计算公式为：（读者借阅总册数÷馆藏书总册数）×100%  
读者到馆率:是指在一定时间（月、学期、学年）到馆借阅书刊的读者人数与本馆拥有读者人数之比。
计算公式为：（年读者到馆总人数÷读者总数）×100% 

总册数
总人数
*/