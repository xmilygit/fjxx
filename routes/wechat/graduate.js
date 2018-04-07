var express = require('express');
var moment = require('moment');
var async = require('async')
var request = require('request');
var mongoose=require('mongoose');
var router = express.Router();

router.get('/', function (req, res, next) {
    /*if (req.session.openid) {
        console.log('session has openid')
        res.render('graduate/studentinfo', {
            title: '桂林市凤集小学--毕业生信息管理系统',
            layout: 'f7layouts',
            useropenid: req.session.openid,
            code: 'code is null'
        })
    } else {
        res.render('wechat/error', {
            layout: null
        })
    }*/
    res.render('graduate/wechat/infoinput',{
        title:'毕业生信息采集',
        layout:'f7layoutsbase'
    })
})

router.post('/GetInfoById', function (req, res, next) {
    console.log(req.session.openid)
    res.setHeader("Access-Control-Allow-Origin", "*");
    var openid = "o_BZpuDFj3Gi-psvtFFDRgl9id-0";//req.session.openid;"opFC7v33Bv242Ic7tMxvt-JbhyD0";//
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
            console.log(stuinfo)
            res.json({ 'recordset': stuinfo })
        })
    })
})

module.exports = router;