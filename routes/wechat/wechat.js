var express = require('express');
var async = require('async')
var request = require('request');
var mongoose=require('mongoose');
var varmange=require('../../model/varmange')
var router = express.Router();

//console.log(varmange.wechatauth);
var myauth = varmange.wechatauth;
/*{
    appid: 'wxba8db6584881bbab',
    appsecret: '7d234a1b76eb803e6683d3a8945985bb',
    token: 'xmilyhh'
};*/

//教师绑定
router.get('/teacher', function (req, res, next) {
    //否则根据code查询openid
    async.series([
        function (callback) {
            fun.getUseOpenId(code, callback);
        }
    ], function (error, result) {
        if (result[0] != "error") {
            //req.session.openid = result[0];
            res.end("选择的是绑定教师"+result[0]);
        } else {
            console.log(error)
        }
    })
    
})
//新生绑定
router.get('/newstudent',function(req,res,next){
    res.end("选择的是新生绑定");
})
//在校生绑定
router.get('/student',function(req,res,next){
    res.end("选择的是在校生绑定");
})
router.get('/', function (req, res, next) {
    let code = req.query['code'];

    //如果缓存中有openid
    if (req.session.openid) {
        console.log('session has openid')
        //res.end("session has openid")
        /*
        res.render('graduate/studentinfo', {
            title: '桂林市凤集小学--毕业生信息管理系统',
            layout: 'f7layouts',
            useropenid: req.session.openid,
            code: 'code is null',
            tregurl:tregurl,
            nsregurl:nsregurl,
            sregurl:sregurl
        })
        */
        res.end("current user is binder,don't get openid")
    } else {
        //否则检查code是否有
        console.log('session is null');
        console.log('code:' + code)
        //如果没有则引导其到绑定页面
        if (code == null) {
            console.log("code is null")
            res.render('wechat/choosetype', {
                title: '选择绑定类型',
                layout: 'f7layouts'
            })
        } else {
            /*
            res.render('wechat/choosetype', {
                title: '选择绑定类型',
                layout: 'f7layouts',
                code:req.query["code"]
            })
            */
            //否则根据code查询openid
            async.waterfall([
                function (callback) {
                    fun.getUseOpenId(code, callback)
                },
                fun.isBinder
            ], function (error, openid, isBinder) {
                if (error) {
                    res.end(error);
                    return;
                }
                if (isBinder){
                    req.session.openid = openid;
                    res.end("current user is binder at get openid")
                    
                }
                else {                    
                    res.render('wechat/choosetype', {
                        title: '选择绑定类型',
                        layout: 'f7layouts',
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
    "isBinder":function(openid,callback){
        if (openid.length > 0) {
            mongoose.model('Account').findOne({ wxopenid: openid }, function (err, doc) {
                console.log(doc);
                if(doc){
                callback(null, openid,true);
                }else{
                    callback(null,openid,false);
                }
            })
        }
    }
}


module.exports = router;