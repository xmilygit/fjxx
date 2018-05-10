var express = require('express'),
    wechatapi = require('wechat-api'),
    fs = require('fs'),
    request = require('request'),
    mongoose = require('mongoose'),
    crypto = require('crypto'),
    wechat = require('wechat'),
    moment = require('moment'),
    appvar = require('../model/varmange'),
    path = require('path'),
    async = require('async'),
    StudentInfo = require('../model/StudentInfoDB'),
    router = express.Router();

//微信接口基本配置信息
//订阅号fjxxmail2的登录配置
/*
var myauth = {
    appid: 'wxbc80d33f96722772',
    appsecret: '087a63126694bcd908b33eeef8f00038',
    token: 'xmilyhh'
}
*/

//测试配置
/*
var myauth = {
    appid: 'wxba8db6584881bbab',
    appsecret: '7d234a1b76eb803e6683d3a8945985bb',
    token: 'xmilyhh'
};
*/
var myauth = appvar.varmng.wechatauth;

//菜单配置
var mymenu = {
    "button": [{
        "name": "和美凤集",
        "sub_button": [{
            "type": "view",
            "name": "2017招生指南",
            "url": 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + myauth.appid + '&redirect_uri=' + encodeURIComponent("http://fjxx.tunnel.echomod.cn/wechat/binder/") + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
        }]
    },
    {
        "name": "我的凤集",
        "type": "view",
        "url": 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + myauth.appid + '&redirect_uri=' + encodeURIComponent("http://fjxxtest.tunnel.echomod.cn/wechat/binder/") + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
    }
    ]
};
//console.log(mymenu)
function sha1(str) {
    var md5sum = crypto.createHash('sha1');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}




//初始化wechat-api库，并将access_token写入文件保存
var api = new wechatapi(myauth.appid, myauth.appsecret, function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile('access_token.txt', 'utf8', function (err, txt) {
        if (err) { return callback(err); }
        callback(null, JSON.parse(txt));
    });
}, function (token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});

function sendapimsg(msg, content) {
    //api mode
    api.sendText(msg.FromUserName, content, function (err, result) {
        if (err) {
            console.log(err.code + err.message);
        }
    });
}

function sendpassivemsg(res, content) {
    res.reply(content);
}

//具体处理微信相关操作的程序
var wechatcustomfun = {
    "binduser": function (msg, req, res) {
        //取出用户输入的用户名和密码
        let regex = /bd#(\S+)#pw#(\S+)#/;
        regex.test(msg.Content);
        let username = RegExp.$1;
        let password = RegExp.$2;

        console.log(RegExp.$1 + "密码:" + RegExp.$2);
        //查询数据库是否找到匹配
        //如果不匹配则提示用户绑定失败，请检查用户名及密码是否正确
        //如果匹配则把用户的OPENID存入记录，并提示用户绑定成功
        let sha1 = crypto.createHash('sha1');
        sha1.update(password);
        mongoose.model('Account').findOne({ 'username': username, 'password': sha1.digest('hex') }, function (err, user) {
            user = user || ''
            if (err) {
                sendapimsg(msg, err.message);
            } else {
                if (user.length <= 0) {
                    sendapimsg(msg, "“" + username + "”该用户不存在!");
                    return;
                }
                let u = user.wxopenid || '';
                if (u.length <= 0) {
                    user.wxopenid = msg.fromusername[0];
                    user.save();
                    sendapimsg(msg, '绑定成功！');
                } else {
                    sendapimsg(msg, '当前用户已绑定！\n\r需要解绑请按以下方式输入：\n\r“jb#用户名#pw#密码#”\n\r例：jb#张三#pw#123456#');
                }
            }
        });
    }
}

//处理微信不同消息类型的程序
var wechatmsgtypefun = {
    "text": function (msg, req, res) {
        switch (true) {
            case (msg.Content == '删除菜单'):
                api.removeMenu(function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result);
                    sendpassivemsg(res, "菜单删除成功")
                })
                break;
            case (msg.Content == '创建菜单'):
                api.createMenu(mymenu, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result);
                    sendpassivemsg(res, "菜单创建成功");
                });
                break;
            case (msg.Content == '获取素材总数'):
                api.getMaterialCount(function (err, result, res2) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result);
                    sendpassivemsg(res, '');
                });
                break;
            case (msg.Content == '获取图文素材'):
                api.getMaterials('news', 0, 10, function (err, result, res2) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(result.item[0].content);
                    sendpassivemsg(res, '');
                });
                break;
            case (msg.Content == '上传一个图片'):
                api.uploadMaterial('D:/node/fjxx/public/0.jpg', 'image', function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                });
                sendpassivemsg(res, '');
                break;
            case (msg.Content == "链接2"):
                sendpassivemsg(res, '<a href="http://fjxx.tunnel.2bdata.com/">链接</a>');
                break;
            case (msg.Content == '链接'):
                sendpassivemsg(res, '<a href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + myauth.appid + '&redirect_uri=' + encodeURIComponent("http://fjxx.tunnel.2bdata.com/") + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect">链接</a>');
                break;
            case (msg.Content == '毕业'):
                sendpassivemsg(res, '<a href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + myauth.appid + '&redirect_uri=' + encodeURIComponent("http://fjxx.tunnel.2bdata.com/graduate/") + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect">毕业</a>')
                break;
            case (/bd#\S+#pw#\S+#/.test(msg.Content)):
                sendpassivemsg(res, '正在绑定你的微信帐户，请稍等...');
                wechatcustomfun['binduser'](msg, req, res);
                break;
            default:
                sendpassivemsg(res,
                    //'/:,@@对不起！无法理解您输入的内容：“' + msg.Content + '”。\n\r' +
                    //'1、绑定您的帐户获取更多服务。\n\r' +
                    //'绑定方式：\n\r' +
                    //'输入:“bd#用户名#pw#密码#”\n\r' +
                    //'例：bd#张三#pw#123456#'
                    '该微信号目前不支持自动回复功能'
                );
                break;
        }
    },
    "event": function (msg, req, res) {
        //wechateventfun[msg.Event[0]](msg, req);
    }
}

//处理微信事件消息的程序
var wechateventfun = {
    "subscribe": function (msg, req) {
        console.log('发生一个事件' + msg)
    }
}
//相关功能
var fun={
    "sendtemplatemessage":function(templateId,data,url,openid){
        api.sendTemplate(openid, templateId, url, data, function (err, result) {
            if (err)
                console.log(err);
            console.log(result)
        });
    }
}

//微信消息处理主入口
/*
router.post('/', function (req, res, next) {
    let inmsg = req.body.xml;
    wechatmsgtypefun[inmsg.msgtype[0]](inmsg, req);
    res.end();
})
*/
// 用于微信后台地址绑定的验证
router.get('/', function (req, res, next) {
    var signature = req.query['signature']
    var echostr = req.query['echostr']
    var timestamp = req.query['timestamp'];
    var nonce = req.query['nonce'];
    var oriArray = ["xmilyhh", timestamp, nonce];
    oriArray.sort();
    var original = oriArray.join('');
    var scyptoString = sha1(original);
    if (signature == scyptoString) {
        res.end(echostr)
        console.log('绑定服务器成功')
    } else {
        res.end('false')
        console.log('绑定服务器失败')
    }
    console.log(signature)
    res.end();
})

//获取wechat js ticket  用于测试
router.get('/t', function (req, res, next) {
    api.getTicket(function (err, result) {
        if (err) {
            console.error(err)
            return
        }
        console.log(result.ticket);
    })
    res.end();

})
//获取用于wechat的JS SDK CONFIG
router.get('/jsconfig', function (req, res, next) {
    var debug = req.query['debug']
    var jsapilist = req.query['jsapilist']
    var url = req.query['url']
    var param = {
        debug: eval(debug),
        jsApiList: jsapilist, // eval('['+jsapilist+']'),
        url: url
    };
    api.getJsConfig(param, function (err, result) {
        //console.log(result);
        res.json(result);
    })
})


//微信消息处理主入口2
router.post('/', wechat(myauth)
    .text(function (msg, req, res, next) {
        wechatmsgtypefun['text'](msg, req, res);
    })
    .event(function (event, req, res, next) {
        //wechatmsgtypefun['event'](event, req, res);
        //console.log(event.Event);
        sendpassivemsg(res, '');
    }).middlewarify()
);
//微信获取临时素材
router.get('/getMedia', function (req, res, next) {
    var mediaId = req.query['mediaid'];
    api.getMedia(mediaId, function (err, result, res2) {
        fs.writeFile(path.resolve(__dirname, '../public/userupload/images/' + mediaId + '.jpg'), result, function (err) {
            if (err) {
                console.log('save fail' + err);
                return
            }

            console.log('save ok')
        })
    })
})

//ajax调用发送模板消息测试  材料准备模板
router.post('/sendtemplate', function (req, res, next) {
    //var templateId = req.body.templateId;
    var templateId = "7-Cuqk5r7qADVGLk8Fr6qMOBUnE_bFB_lsg7cbHGaGs"
    var msg = req.body.msg;
    var queryhome = req.body.queryhome;
    //var templateId = 'hK0TIi7znV-26YTWtchQgDkA_jBD0hLi0xksT7bxjmQ';
    // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
    /*
    if (queryhome=="true"){
        var url = "http://"+req.hostname+"/wechat/graduate/querypid";
        msg+="\n\r\n\r请点击此文字，输入房产情况查询表!";
    }
    else
        var url = ""
    */
    var url = "http://" + req.hostname + "/wechat/graduate/dispresult?openid=" + req.session.openid;
    msg += "\n\r\n\r注意：\n\r1、所提交材料均需要提交原件。\n\r2、本结果仅做为材料提交参考，最终以学校审核结果为准。"
    var data = {
        "first": {
            "value": '毕业生材料提交参考',
            "color": "#173177"
        },
        "keyword1": {
            "value": '该结果仅做为家长用于参考提交材料，不是最后审核结果',
            "color": "#173177"
        },
        "keyword2": {
            "value": '系统',
            "color": "#173177"
        },
        "keyword3": {
            "value": '',
            "color": "#173177"
        },
        "remark": {
            "value": "需要提交的材料如下：\n" + msg,
            "color": "#173177"
        }
    };
    if (req.session.openid) {
        //'o_BZpuDFj3Gi-psvtFFDRgl9id-0'
        api.sendTemplate(req.session.openid, templateId, url, data, function (err, result) {
            if (err) {
                console.log(err);
                res.json({ 'error': true, 'message': err });
                return;
            }
            console.log(result)
            res.json({ 'error': null, 'message': 'ok' });
        });
    }
})
//发送模板消息测试
router.get('/sendtemplate', function (req, res, next) {
    var templateId = 'hK0TIi7znV-26YTWtchQgDkA_jBD0hLi0xksT7bxjmQ';
    // URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
    var url = 'http://www.163.com';
    var data = {
        "material": {
            "value": "欢迎再次购买!",
            "color": "#173177"
        }
    };
    api.sendTemplate('o_BZpuDFj3Gi-psvtFFDRgl9id-0', templateId, url, data, function (err, result) {
        if (err)
            console.log(err);
        console.log(result)
        res.end();
    });
})



//ajax调用发送获取学籍号户口房产信息的模板消息
router.post('/sendtemplate2', function (req, res, next) {
    if (req.session.openid) {
        var openid = req.session.openid;
        var templateId = "4J_wT2rH8dcOLlxp84BC04Ie3Fjefj0_mGp8uUvOWwc";
        async.auto([
            function (cb) {
                StudentInfo.GetAccountInfoByOpenid(openid, cb)
            }
        ], function (err, st) {
            if (err) {
                res.json({ 'error': true, 'message': '执行查询出错!' + "[" + err.message + "]" })
                return;
            }
            st=st[0];

            var data={
                "first": {
                    "value": "毕业生信息",
                    "color": "#173177"
                },
                "keyword1":{
                    "value":st.学籍号,
                    "color":"#173177"
                },
                "keyword2":{
                    "value":st.姓名,
                    "color":"#173177"
                },
                "keyword3":{
                    "value":'',
                    "color":"#173177"
                },
                "remark":{
                    "value":"户籍地址："+st.现住址+"\n居住地址："+st.家庭地址,
                    "color":"#173177"
                }
            };

            fun.sendtemplatemessage(templateId,data,'',openid)
            res.json({ "data": st });
        })
    } else {
        res.json({ 'error': true, 'message': '当前用户登记已过期!' })
    }
})

//显示永久素材（图片）列表
router.get('/images', function (req, res, next) {
    api.getMaterials('news', 0, 10, function (err, result, res2) {
        if (err) {
            console.error('获取素材集合失败：' + err);
            res.render('wechat/error')
            return;
        }
        console.log(result)
        var images = result;
        res.render('wechat/images', { title: '永久图片素材列表', imgs: images });
    });
    //let images = require('../model/imageslist.json');
    //res.render('wechat/images', { title: '永久图片素材列表', imgs: images });
});

//显示添加永久素材页面
router.get('/pictxt', function (req, res, next) {
    /*
    let txt='（原标题：2017年2月15日外交部发言人耿爽主持例行记者会）<img src="http://cms-bucket.nosdn.127.net/b005364b149f4f40b92f1b9abe16c8a320170215175605.jpeg?imageView&thumbnail=550x0" alt="undefined"/>应国务院总理李克强邀请，法兰西共和国总理贝尔纳·卡泽纳夫将于2月21日至23日对中国进行正式访问。此次系卡泽纳夫理首次访华，也是今年首位欧洲国家领导人来访。';
    let pictxtjson={
 "articles": [
   {
     "title": 'TITLE',
     "thumb_media_id": 'dMNqI8ZACG8uYl7ddIFTXY_Xoy5qCuYjaAwshZhOXlQ',
     "author": 'AUTHOR',
     "digest": 'DIGEST',
     "show_cover_pic": 0,
     "content":txt,
     "content_source_url": 'CONTENT_SOURCE_URL'
   }
   //若新增的是多图文素材，则此处应还有几段articles结构
 ]
}

    api.uploadNewsMaterial(pictxtjson,function(err,result){
        if(err){
            console.log(err);
        }
        console.log(result);
    })
    */
    api.getMaterial('dMNqI8ZACG8uYl7ddIFTXYfM1NnHv9j64eByckparnA', function (err, result, res) {
        if (err)
            console.log(err);

        console.log(result.toString('utf-8'));
    });
    let images = require('../model/imageslist.json');
    res.render('wechat/pictxt', { title: '添加永久图文素材', imgs: images })
})
console.log('微信监听已启动')
module.exports = router;