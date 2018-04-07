var express = require('express');
var async = require('async')
var request = require('request');
var mongoose = require('mongoose');
var crypto = require('crypto');
var varmange = require('../../model/varmange')
var router = express.Router();

var myauth = varmange.varmng.wechatauth;
router.post("*",function(req,res,next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
})

//router.get("*",function(req,res,next){
//    console.log("该显示证明执行了*处的代码");
//    next();
//})
//教师绑定
router.post('/teacher', function (req, res, next) {
    var username=req.body.username;
    var password=fun.passwordsha1(req.body.password);
    var openid=req.session.openid;
    mongoose.model('Account').findOne({ username: username, password: password },'wxopenid',{upsert:true}, function (err, doc) {
        if (err) {
            res.json({ 'error': true, 'message': err });
            return;
        }
        if (doc) {
            console.log(doc.wxopenid)
            if (doc.wxopenid && doc.wxopenid.length > 0) {
                res.json({ 'error': true, 'message': '该用户已绑定，请检查用户名及密码是否正确' })
                return;
            }
            doc.wxopenid=openid;
            doc.save(function (err, result) {
                if (err) {
                    res.json({ 'error': true, 'message': err });
                    return;
                }
                res.json({ 'recordset': result });
            });
        } else {
            res.json({ 'recordset': doc })
        }
    })
})
//新生绑定
/*
router.get('/newstudent', function (req, res, next) {
    res.end("选择的是新生绑定");
})
*/
//在校生绑定
/*
router.get('/student', function (req, res, next) {
    res.end("选择的是在校生绑定");
})
*/

router.get('*', function (req, res, next) {
    let code = req.query['code'];
    //如果缓存中有openid
    if (req.session.openid) {
        console.log('session has openid')
        async.waterfall([
            function (callback) {
                fun.isBinder(req.session.openid, callback)
            }],
            function (err, openid, doc, isBinder) {
                if (err) {
                    res.end(err)
                    return;
                }

                if (isBinder) {
                    //res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    /*if (doc.infoid) {
                        res.redirect('/wechat/stuinfo')
                        //res.end("当前绑定的用户是新生")
                        return;
                    }*/
                    if (doc.usertype=="graduate") {
                        //res.end("old student")
                        res.redirect('/wechat/graduate')
                        return;
                    }

                    res.end("当前绑定的是教师")
                }
                else {
                    res.render('wechat/choosetype', {
                        title: '选择绑定类型',
                        layout: 'f7layoutsbase',
                        openid: openid
                    })
                }
            }
        )
    } else {
        //否则检查code是否有
        console.log('session is null');
        console.log('code:' + code)
        //如果没有则引导其到绑定页面
        if (code == null) {
            console.log("code is null")
            res.render('wechat/error',{
                layout:null
            })
        } else {
            //否则根据code查询openid
            async.waterfall([
                function (callback) {
                    fun.getUseOpenId(code, callback)
                },
                fun.isBinder
            ], function (error, openid, doc,isBinder) {
                if (error) {
                    res.end(error);
                    return;
                }
                if (isBinder) {
                    //res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'})
                    req.session.openid = openid;
                    /*if (doc.infoid) {
                        res.redirect('/wechat/stuinfo')
                        //res.end("当前绑定的用户是新生")
                        return;
                    }*/
                    if (doc.usertype=='graduate') {
                        //res.end("毕业生")
                        res.redirect("/wechat/graduate")
                        return;
                    }

                    res.end("当前绑定的是教师")
                }
                else {
                    req.session.openid = openid;
                    res.render('wechat/choosetype', {
                        title: '选择绑定类型',
                        layout: 'f7layoutsbase',
                        openid: openid
                    })
                }
            })
        }

    }
})

var fun = {
    "getUseOpenId": function (code, callback) {
        let url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + myauth.appid + "&secret=" + myauth.appsecret + "&code=" + code + "&grant_type=authorization_code "
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                if (result.errcode) {
                    callback(result.errmsg, null)
                } else {
                    callback(null, result.openid);
                }
            } else {
                console.log("获取useropenid时出错：" + error)
                callback("获取useropenid时出错", null);
            }
        })
    },
    "isBinder": function (openid, callback) {
        if (openid.length > 0) {
            mongoose.model('Account').findOne({ wxopenid: openid }, function (err, doc) {
                //console.log(doc);
                if (doc) {
                    callback(null, openid, doc,true);
                } else {
                    callback(null, openid, null,false);
                }
            })
        }
    },
    "passwordsha1": function (str) {
        var md5sum = crypto.createHash('sha1');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    }
}


module.exports = router;