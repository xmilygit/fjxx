var fs = require("fs");
//正式配置
var wechatauth = {
    appid: 'wx4e22ba98362ec444',
    appsecret: '456d2b7769f5e91cd208a8399964d53f',
    token: 'xmilyhh'
}

//测试号配置
/*
var wechatauth = {
    appid: 'wxba8db6584881bbab',
    appsecret: '7d234a1b76eb803e6683d3a8945985bb',
    token: 'xmilyhh'
};
*/
//MXThink测试用
/*
var wechatauth={
    appid:'wxbc80d33f96722772',
    appsecret:'50d110e3e2c1cac00c8e0f51038f2cdd',
    token:'xmilyhh'
}
*/
exports.varmng = { wechatauth: wechatauth };
//module.exports = { wechatauth: wechatauth }
//以下是获取全部开关等状态的方法
exports.GetAllOnOff = function(cb) {
        fs.readFile("appvar.txt", function(err, txt) {
            if (err) {
                console.error("读取应用基础数据失败!部分功能可能失效!");
                cb("读取应用基础数据失败!部分功能可能失效!", null);
                return;
            }
            var t = JSON.parse(txt.toString());
            cb(null, t)
        })
    }
    //以下是改进功能版本
exports.GetEnable = function(tg, cb) {
        fs.readFile("appvar.txt", function(err, txt) {
            if (err) {
                console.error("读取应用基础数据失败!部分功能可能失效!");
                cb("读取应用基础数据失败!部分功能可能失效!", null);
                return;
            }
            var t = JSON.parse(txt.toString());
            //console.log(eval("t."+tg));
            cb(null, eval("t." + tg))
        })
    }
    //以下是原来的版本
exports.GetNewStuInfoEnable = function(cb) {
        fs.readFile("appvar.txt", function(err, txt) {
            if (err) {
                console.error("读取应用基础数据失败!部分功能可能失效!");
                cb("读取应用基础数据失败!部分功能可能失效!", null);
                return;
            }
            var t = JSON.parse(txt.toString())
            console.log(t.newstudentinfoEnable);
            cb(null, t.newstudentinfoEnable);
        })
    }
    //以下是原来的版本修改状态全局变量的单一方法（20180506改进为SetEnable方法）
exports.SetNewStuInfoDisable = function(state, cb) {
    fs.readFile("appvar.txt", function(err, txt) {
        if (err) {
            console.error("写入应用基础数据失败!部分功能可能失效!")
            cb("写入应用基础数据失败!部分功能可能失效!", null)
            return;
        }
        var t = JSON.parse(txt.toString())
        console.log(t.newstudentinfoEnable);
        state = state === 'false' ? false : true;
        t.newstudentinfoEnable = state;
        fs.writeFile("appvar.txt", JSON.stringify(t), function(err) {
            if (err) {
                console.error('写入应用基础数据失败！部分功能可能出现异常！')
                cb("写入应用基础数据失败！部分功能可能出现异常！", null)
                    //return;
            }
            cb(null, '写入成功')
        })
    })
}

//改进的修改状态的全局变量的通用方法
exports.SetEnable = function(state, tg, cb) {
    fs.readFile("appvar.txt", function(err, txt) {
        if (err) {
            console.error("写入应用基础数据失败!部分功能可能失效!")
            cb("写入应用基础数据失败!部分功能可能失效!", null)
            return;
        }
        var t = JSON.parse(txt.toString())
        state = state === 'false' ? false : true;
        eval("t." + tg + "=" + state);
        fs.writeFile("appvar.txt", JSON.stringify(t), function(err) {
            if (err) {
                console.error('写入应用基础数据失败！部分功能可能出现异常！')
                cb("写入应用基础数据失败！部分功能可能出现异常！", null)
                    //return;
            }
            cb(null, '写入成功')
        })
    })
}