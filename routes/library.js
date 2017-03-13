var express = require('express')
var router = express.Router();
var sql = require('mssql');
var moment = require('moment');

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
//获取逾期未还记录
router.post('/unreturnBook', function (req, res, next) {
    let currentpage = parseInt(req.body.currentpage) - 1;
    let pagesize = parseInt(req.body.pagesize);
    let beginnum = parseInt(pagesize * currentpage) + 1
    let endnum = beginnum + pagesize - 1;
    let keyword = req.body.keyword;
    let daterange1 = req.body.daterange.substring(0, 10).replace(/-/g, '');
    let daterange2 = req.body.daterange.substring(13, 23).replace(/-/g, '');

    var sqlstr = "with temp as(select *,row_number() over(order by hnyr) as id from v_borrow where hsbz=0 and hnyr>='" + daterange1 + "' and hnyr<='" + daterange2 + "' and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')) select top " + pagesize + " * from temp where id between " + beginnum + " and " + endnum;
    var sqlstr2 = "select count(*) as recosum from v_borrow where hsbz=0 and hnyr>='" + daterange1 + "' and hnyr<='" + daterange2 + "' and (dzxm like '%" + keyword + "%' or sm like '%" + keyword + "%')"
    res.setHeader("Access-Control-Allow-Origin", "*");

    sqlhelp(res, sqlstr + ";" + sqlstr2, '获取逾期未还记录', true)
})

let year = moment().year();
let month = moment().month() + 1;
let year1 = month >= 9 ? year - 5 : year - 6;
let year2 = month >= 9 ? year : year - 1;

//获取所有读者分类
router.post('/getgroup', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    //console.log(year1+"{}"+year2)
    let sqlstr = "select * from (select dzdw,count(*) as sumnum from dz  group by dzdw)a where left(dzdw,4)>='" + year1 + "' and left(dzdw,4)<='" + year2 + "' or dzdw='教师' order by dzdw";
    sqlhelp(res, sqlstr, '读者分类');
})

//获取所有图书总数
router.get('/getbookscount', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let sqlstr = 'select sum(bookcount) as bookscount from(select sm,zz,cbs,dj,sum(cs) as bookcount from ts group by sm,zz,cbs,dj)a';
    sqlhelp(res, sqlstr, '图书总数');
})

//获取所有图书种类总数
router.get('/getbookclasscount', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let sqlstr = 'select count(bookcount) as bookclasscount from(select sm,zz,cbs,dj,sum(cs) as bookcount from ts group by sm,zz,cbs,dj)a';
    sqlhelp(res, sqlstr, '图书种类');
})

//获取某时间段借出图书总数
router.get('/getborrow', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    let daterange1 = req.query['daterange'].substring(0, 10).replace(/-/g, '');
    let daterange2 = req.query['daterange'].substring(13, 23).replace(/-/g, '');

    var sqlstr = "select count(*) as recosum from v_borrow where jnyr>='" + daterange1 + "' and jnyr<='" + daterange2 + "'";
    sqlhelp(res, sqlstr, '获取一定时间内借书数量')
})

//获取某时间段选定读者到馆人数
router.get('/getvisiuser', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    let daterange1 = req.query['daterange'].substring(0, 10).replace(/-/g, '');
    let daterange2 = req.query['daterange'].substring(13, 23).replace(/-/g, '');
    let usergroups = req.query['usergroups'] || "";
    var sqlstr = "", sqlstr2 = "";
    if (usergroups.length <= 0) {
        sqlstr = "select count(books) as visiusercount from(select dztm,count(dztm) as books from  v_borrow  where jnyr>='" + daterange1 + "' and jnyr<='" + daterange2 + "' group by dztm)a";
        sqlstr2 = "select count(*) as selectalluser from dz where left(dzdw,4)>='" + year1 + "' and left(dzdw,4)<='" + year2 + "' or dzdw='教师'";
    } else {
        let temp = "";
        usergroups.forEach(function (item, index, array) {
            temp = temp + "'" + item + "',"
        })
        temp = temp.substring(0, temp.length - 1);
        sqlstr = "select count(books) as visiusercount from(select dztm,count(dztm) as books from  v_borrow  where jnyr>='" + daterange1 + "' and jnyr<='" + daterange2 + "' and dzdw in(" + temp + ")group by dztm)a"
        sqlstr2 = "select count(*) as selectalluser from dz where dzdw in(" + temp + ")";
    }
    sqlhelp(res, sqlstr + ";" + sqlstr2, '获取某段时间内读者到馆人数', true)
})

//获取某时间段选定读者借阅数
router.get('/getvisiuserborrow', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    let daterange1 = req.query['daterange'].substring(0, 10).replace(/-/g, '');
    let daterange2 = req.query['daterange'].substring(13, 23).replace(/-/g, '');
    let usergroups = req.query['usergroups'] || "";
    var sqlstr = "";
    if (usergroups.length <= 0) {
        sqlstr = "select sum(books) as visiusercount from(select dztm,count(dztm) as books from  v_borrow  where jnyr>='" + daterange1 + "' and jnyr<='" + daterange2 + "' group by dztm)a";
    } else {
        let temp = "";
        usergroups.forEach(function (item, index, array) {
            temp = temp + "'" + item + "',"
        })
        temp = temp.substring(0, temp.length - 1);
        sqlstr = "select sum(books) as visiusercount from(select dztm,count(dztm) as books from  v_borrow  where jnyr>='" + daterange1 + "' and jnyr<='" + daterange2 + "' and dzdw in(" + temp + ")group by dztm)a"
    }
    sqlhelp(res, sqlstr, '获取某段时间内选定读者到馆人数')
})

//数据库查询辅助类
function sqlhelp(res, sqlstr, readme, multiple) {
    let connection = new sql.Connection(config, function (err) {
        if (err) {
            console.log("获取" + readme + "时发生连接错误:" + err);
            res.json({ 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err });
        }
        //let sqlstr = 'select sum(bookcount) as bookscount from(select sm,zz,cbs,dj,sum(cs) as bookcount from ts group by sm,zz,cbs,dj)a';
        //var request = new sql.Request(connection1);
        let request = connection.request();
        request.multiple = multiple || false;
        request.query(sqlstr, function (err, recordset) {
            if (err) {
                console.log('获取' + readme + '时查询失败：' + err);
                res.json({ 'type': 'error', 'message': '获取' + readme + '时查询失败：' + err });
            }
            console.log('成功获取到' + readme + '');
            res.json({ 'type': 'ok', 'readme': readme, 'recordset': recordset })
        })
    })
}

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
ok藏书利用率：是指在一定的时期(学期、学年)，全部书刊资料被读者利用的数量占全部馆藏的百分比。
计算公式为：（读者利用册数÷馆藏书总册数）×100%  


读者借阅率：是指在一定的时期(学期、学年)，平均每个读者所借的书刊资料数量。
计算公式为：（借阅总册数÷借阅总人数）×100%  


ok图书流通率：是指在一定的时期(学期、学年)，用于公开借阅的书刊被读者借阅的数量所占的百分比。
计算公式为：（读者借阅总册数÷馆藏书总册数）×100% 


ok读者到馆率:是指在一定时间（月、学期、学年）到馆借阅书刊的读者人数与本馆拥有读者人数之比。
计算公式为：（年读者到馆总人数÷读者总数）×100% 


复本率=馆藏册(件)数/馆藏种数ok
总册数ok
总人数ok
*/