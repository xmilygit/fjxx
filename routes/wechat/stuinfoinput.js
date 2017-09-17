var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var async = require('async');

/*
router.all('*',function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin", "*");
    next;
})
*/
router.get('/', function (req, res, next) {
    if (req.session.openid) {
        res.render('Student/wechat/studentinfoinput', {
            title: '新生学籍信息采集',
            layout: 'f7layoutsbase'
        })
    } else {
        res.render('wechat/error', {
            layout: null
        })
    }
})

router.post('/GetInfoById', function (req, res, next) {
    console.log(req.session.openid)
    res.setHeader("Access-Control-Allow-Origin", "*");
    var openid = req.session.openid;//"o_BZpuDFj3Gi-psvtFFDRgl9id-0";//
    mongoose.model('Account').findOne({ wxopenid: openid }, { infoid: 1 }, function (err, doc) {
        if (err) {
            if (err) {
                res.json({ 'error': true, 'message': err });
                return;
            }
        }
        var query = mongoose.model('StudentInfo').findById(doc.infoid);
        query.exec(function (err, stuinfo) {
            if (err) {
                res.json({ 'error': true, 'message': err });
                return;
            }
            //console.log(stuinfo)
            res.json({ 'recordset': stuinfo })
        })
    })
})

router.post('/SaveInfoByOpenid', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var openid = req.session.openid;//"o_BZpuDFj3Gi-psvtFFDRgl9id-0";//
    var stdata = JSON.parse(req.body.stdata);
    var fsdata = JSON.parse(req.body.fsdata);
    var stu = {
        "姓名": stdata.stuname,
        "性别": stdata.gender,
        "出生日期": stdata.dob,
        "民族": stdata.nation,
        "家庭地址": stdata.homeaddress,
        "现住址": stdata.regaddress,
        "籍贯": stdata.origin,
        "身份证件号": stdata.pid,
        "是否独生子女": stdata.onlychild.length == 0 ? "否" : stdata.onlychild[0],
        "是否受过学前教育": stdata.preschool.length == 0 ? "否" : stdata.preschool[0],
        "户口性质": stdata.regtype,
        "出生地行政区划代码": stdata.borncode,
        "户口所在地行政区划": stdata.regcode,
        "邮政编码": stdata.zipcode,
        "成员1姓名": fsdata.fname,
        "成员1关系": fsdata.frelationship,
        "成员1是否监护人": fsdata.Fguardian.length == 0 ? "否" : fsdata.Fguardian[0],
        "成员1现住址": fsdata.fhomeaddress,
        "成员1户口所在地行政区划": fsdata.fregcode,
        "成员1联系电话": fsdata.ftel,
        "成员2姓名": fsdata.sname,
        "成员2关系": fsdata.srelationship,
        "成员2是否监护人": fsdata.sguardian.length == 0 ? "否" : fsdata.sguardian[0],
        "成员2现住址": fsdata.shomeaddress,
        "成员2户口所在地行政区划": fsdata.sregcode,
        "成员2联系电话": fsdata.stel
    }

    mongoose.model('Account').findOne({ wxopenid: openid }, { infoid: 1 }, function (err, doc) {
        if (err) {
            if (err) {
                res.json({ 'error': true, 'message': String(err).replace('ValidationError: ', '') });
                return;
            }
        }
        //console.log(doc.infoid)
        mongoose.model('StudentInfo').findByIdAndUpdate(doc.infoid, stu, { runValidators: true }, function (err, doc2) {
            if (err) {
                res.json({ 'error': true, 'message': String(err).replace('ValidationError: ', '') });
                return;
            }
            res.json({ 'recordset': doc2 });
        })
    })
})


module.exports = router;