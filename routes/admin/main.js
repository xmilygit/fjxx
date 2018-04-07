var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var async = require('async');
var appvar=require("../../model/varmange");


router.get('/', function (req, res, next) {
    /*
    mongoose.model('Account').find({}, function (err, result) {
        if (err)
            console.log('err:' + err)
        else {
            //console.log(res);
            res.render('admin/index', {
                "title": "网站管理",
                //layout: 'f7layoutsmain',
                account: result
            });
        }
    })
    */
    res.render('admin/index',
        {
            title: '网站管理',
            layout: null
        }
    )
})

router.get('/test', function (req, res, next) {
    res.render('admin/test', { layout: null })
})

//保存修改的用户记录
//还需要增加修改后的PID不能重复的判断功能
router.post('/updateacc', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    //var account=req.body.account;
    console.log(req.body._id);
    mongoose.model('Account').findOne(
        { '_id': req.body._id },
        function (err, doc) {
            if (err) {
                res.json({ 'error': true, 'message': err });
                return;
            }
            doc.username = req.body.username;
            doc.pid = req.body.pid;
            doc.gender = req.body.gender;
            doc.dob = req.body.dob;
            doc.save(true, function (err, doc2, numAffected) {
                if (err) {
                    console.log(String(err))
                    res.json({ 'error': true, 'message': String(err) });
                    return;
                }
                res.json({ doc: doc2 });
            });
            //res.json({ doc: doc })
        })
})
//添加用户
//还需要增加修改后的PID不能重复的判断功能
router.post('/insertacc', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    //var sha1=crypto.createHash('sha1');
    //sha1.update(req.body.password);
    mongoose.model("Account").create({
        username: req.body.username,
        pid: req.body.pid,
        gender: req.body.gender,
        dob: req.body.dob,
        password: Enpassword(req.body.password)
    }, function (err, doc) {
        if (err) {
            console.log(String(err))
            res.json({ 'error': true, 'message': String(err) })
            return
        } else {
            res.json({ 'type': 'ok', 'doc': doc });
        }

    })
    //res.json({ 'type': 'error', 'message': '测试错误' })
});

//密码重置
router.post('/rstpw', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var npw = req.body.npw;    
    var id = req.body.id;
    var valid = /^(?:\d+|[a-zA-Z]+|[_!@#$%^&*]+){6,15}$/.test(npw);
    if (!valid) {
        res.json({ 'error': true, message: '密码不符合要求' })
        return;
    }
    mongoose.model('Account').findByIdAndUpdate(
        id,
        { password: Enpassword(npw)},
        function (err, result) {
            if (err) {
                res.json({ 'error': true, 'message': err });
                return
            }
            res.json({ 'type': 'ok', 'doc': result });
        }
    )
})


//删除用户
router.get('/delacc', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var id = req.query['id'];
    mongoose.model("Account").findByIdAndRemove(
        id,
        function (err, result) {
            if (err) {
                res.json({ 'error': true, 'message': err });
                return;
            }
            if (result)
                res.json({ 'type': 'ok', 'doc': result })
            else
                res.json({ 'error': true, 'message': '未找到任何记录' })
        }
    )
})

//解除微信绑定
router.get('/unbinder',function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin',"*");
    var id=req.query['id'];
    mongoose.model('Account').findById(
        id,
        function(err,doc){
            if(err){
                res.json({'error':true,'message':err});
                return;
            }
            if(doc){
                doc.wxopenid=null;
                doc.save(function(err,result){
                    if(err){
                        res.json({'error':true,'message':err});
                        return;
                    }
                    res.json({'recordset':result});
                })
            }

        }
    )
})

//读取用户数据时不读取密码信息
//获取所有用户记录
router.get('/getaccountlist', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var pagesize = parseInt(req.query["pagesize"]);
    var lastid = req.query['lastid'];
    async.auto({
        getCount: function (callback) {
            mongoose.model('Account').count({}, function (err, result) {
                if (err)
                    callback(err, null)
                else
                    callback(null, result)
            })
        },
        getDate: function (callback) {
            if (lastid) {
                mongoose.model('Account')
                    .find({ "_id": { $gt: lastid } })
                    .sort({ "_id": 1 })
                    .limit(pagesize)
                    .exec(function (err, result) {
                        if (err)
                            callback(err, null)
                        else
                            callback(null, result)
                    })
            } else {
                mongoose.model('Account')
                    .find({})
                    .sort({ "_id": 1 })
                    .limit(pagesize)
                    .exec(function (err, result) {
                        if (err)
                            callback(err, null)
                        else
                            callback(null, result)
                    })
            }
        }
    }, function (err, results) {
        if (err)
            res.json({ "error": err, "text": "读取数据时出错!" });
        else {
            res.json({ "recordset": results });
        }
    })
})
//密码HASH
function Enpassword(password) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(password);
    return sha1.digest('hex')
}

//搜索用户
router.get('/usersearch', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var pagesize = parseInt(req.query["pagesize"]);
    var lastid = req.query['lastid'];
    var keyword = req.query['keyword'];
    var query = {};
    async.auto({
        getCount: function (callback) {
            query = {
                $or: [
                    { username: { $regex: keyword } },
                    { pid: { $regex: keyword } }
                ]
            }
            mongoose.model('Account').count(query, function (err, result) {
                if (err)
                    callback(err, null)
                else
                    callback(null, result)
            })
        },
        getDate: function (callback) {
            if (lastid) {
                query = {
                    $or: [
                        { username: { $regex: keyword } },
                        { pid: { $regex: keyword } }                        
                    ],
                    _id: { $lt:lastid }
                }
                mongoose.model('Account')
                    .find(query)
                    .sort({ _id: -1 })
                    .limit(pagesize)
                    .exec(function (err, result) {
                        if (err)
                            callback(err, null)
                        else
                            callback(null, result)
                    })
            } else {
                query = {
                    $or: [
                        { username: { $regex: keyword } },
                        { pid: { $regex: keyword } }
                    ]
                }
                mongoose.model('Account')
                    .find(query)
                    .sort({_id: -1 })
                    .limit(pagesize)
                    .exec(function (err, result) {
                        if (err)
                            callback(err, null)
                        else
                            callback(null, result)
                    })
            }
        }
    }, function (err, results) {
        if (err)
            res.json({ "error": true, "message": "读取数据时出错!" });
        else {
            res.json({ "type":"ok","recordset": results });
        }
    })
    /*
    var keyword = req.query['keyword'];
    mongoose.model('Account').find(
        {
            $or: [
                { username:{$regex:keyword}},
                { pid:{$regex:keyword} }
            ]
        }, function (err, docs) {
            if(err){
                res.json({'error':true,'message':'数据查询失败'});
                return;
            }
            res.json({'type':'ok','recordset':docs});
            console.log(docs);
        }
    )
    */
})


//获取信息录入激活状态（改进版20180407)
router.get('/getgraduateinfoenable', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var tgstr=req.query['target'];
    async.auto({
        method1: function (callback) {
            appvar.GetEnable(tgstr, callback);
        }
    }, function (err, result) {
        if (err) {
            res.json({ 'error': true, 'message': err });
            retur;
        } else {
            res.json({ 'type': "ok", "recordset": result.method1 });
            return;
        }

    })
})

//获取新生信息录入激活状态(可使用上面改进版本20180407暂没改动)
router.get('/getnewstuinfoenable', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    async.auto({
        method1: function (callback) {
            appvar.GetNewStuInfoEnable(callback);
        }
    }, function (err, result) {
        if (err) {
            res.json({ 'error': true, 'message': err });
            return
        } else {
            res.json({ "type": "ok", 'recordset': result.method1 });
            return
        }
    })
})

//设置新生信息录入激活状态
router.get('/setnewstuinfoenable', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    async.auto({
        method1:function(callback){
            appvar.SetNewStuInfoDisable(req.query['state'],callback)
        }
    },function(err,result){
        if(err){
            res.json({ 'error': true, 'message': err });
            return
        }else{
            res.json({ "type": "ok", recordset: req.query['state'] });
            return
        }
    })
})
module.exports = router;
