var fs = require("fs");

var wechatauth = {
    appid: 'wxba8db6584881bbab',
    appsecret: '7d234a1b76eb803e6683d3a8945985bb',
    token: 'xmilyhh'
};

exports.varmng = { wechatauth: wechatauth };
//module.exports = { wechatauth: wechatauth }
exports.GetNewStuInfoEnable = function (cb) {
    fs.readFile("appvar.txt", function (err, txt) {
        if (err) {
            console.error("读取应用基础数据失败!部分功能可能失效!");
            cb("读取应用基础数据失败!部分功能可能失效!",null);
            return;
        }
        var t = JSON.parse(txt.toString())
        console.log(t.newstudentinfoEnable);
        cb(null,t.newstudentinfoEnable);
    })
}
exports.SetNewStuInfoDisable = function (state,cb) {
    fs.readFile("appvar.txt", function (err, txt) {
        if (err) {
            console.error("写入应用基础数据失败!部分功能可能失效!")
            cb("写入应用基础数据失败!部分功能可能失效!",null)
            return;
        }
        var t = JSON.parse(txt.toString())
        console.log(t.newstudentinfoEnable);
        state=state==='false'?false:true;
        t.newstudentinfoEnable = state;
        fs.writeFile("appvar.txt", JSON.stringify(t), function (err) {
            if (err) {
                console.error('写入应用基础数据失败！部分功能可能出现异常！')
                cb("写入应用基础数据失败！部分功能可能出现异常！",null)
                //return;
            }
            cb(null,'写入成功')
        })
    })
}