//StudentInfo 表的相关增删查改操作
var mongoose = require('mongoose');

//读取1
exports.GetStudentInfo1 = function(id) {
    var query = mongoose.model('StudentInfo').findById(id);
    query.exec(function(err, stuinfo) {
        if (err) {
            return json({ 'error': true, 'message': err });
        }
        //console.log(stuinfo)
        return json({ 'data': stuinfo })
    })
}

//根据 openid 返回studentinfo的数据
exports.GetAccountInfoByOpenid = function(openid, cb) {
    mongoose.model('Account').findOne({ wxopenid: openid }, { infoid: 1 }, function(err, doc) {
        if (err) {
            if (err) {
                cb({ 'error': true, 'message': err }, null);
                return;
            }
        }
        var query = mongoose.model('StudentInfo').findById(doc.infoid);
        query.exec(function(err, stuinfo) {
            if (err) {
                cb({ 'error': true, 'message': err }, null);
            }
            cb(null, stuinfo)
        })
    })
}