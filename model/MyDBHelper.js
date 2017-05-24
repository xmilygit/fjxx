//数据库查询辅助类
var sql = require('mssql')

var MyDBHelper={
    config:'',
    execsql:function(res, sqlstr, readme, multiple) {
        let connection = new sql.Connection(this.config, function (err) {
            if (err) {
                console.log("获取" + readme + "时发生连接错误:" + err);
                res.json({ 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err });
            }
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
    },
    execsqlAsync:function(callback, sqlstr, readme, multiple) {
        let result='';
        let connection = new sql.Connection(this.config, function (err) {
            if (err) {
                console.log("获取" + readme + "时发生连接错误:" + err);
                //res.json({ 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err });
                result={ 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err };
                callback(err,result)
            }
            let request = connection.request();
            request.multiple = multiple || false;
            request.query(sqlstr, function (err, recordset) {
                if (err) {
                    console.log('获取' + readme + '时查询失败：' + err);
                    result={ 'type': 'error', 'message': '获取' + readme + '时查询失败：' + err };
                    callback(err,result)
                }
                console.log('成功获取到' + readme + '');
                result={ 'type': 'ok', 'readme': readme, 'recordset': recordset };
                callback(err,result)
            })
        })
    }
}


/*
class MyDBHelper {
    static abcd;
    constructor(config) {
        this.config = config
    }
    

    static execsql(res, sqlstr, readme, multiple) {
        let connection = new sql.Connection(this.config, function (err) {
            if (err) {
                console.log("获取" + readme + "时发生连接错误:" + err);
                res.json({ 'type': 'error', 'message': '获取' + readme + '时发生连接失败错误：' + err });
            }
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

}
*/

module.exports = MyDBHelper