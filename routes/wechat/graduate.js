var express = require('express');
var moment = require('moment');
var async = require('async')
var request = require('request');
var mongoose = require('mongoose');
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
    res.render('graduate/wechat/infoinput', {
        title: '毕业生信息采集',
        layout: 'f7layoutsbase'
    })
})

router.post('/GetInfoById', function (req, res, next) {
    //console.log(req.session.openid)
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
            //console.log(stuinfo)
            res.json({ 'recordset': stuinfo })
        })
    })
})

router.post('/SaveInfoByOpenid', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var openid = "o_BZpuDFj3Gi-psvtFFDRgl9id-0";//req.session.openid;//
    var stdata = JSON.parse(req.body.stdata);
    stdata.freglocation = stdata.fregsame == "是" ? stdata.stureglocation : stdata.freglocation;
    stdata.sreglocation = stdata.sregsame == "是" ? stdata.stureglocation : stdata.sreglocation;
    stdata.freglocationcode = stdata.fregsame == "是" ? stdata.stureglocationcode : stdata.freglocationcode;
    stdata.sreglocationcode = stdata.sregsame == "是" ? stdata.stureglocationcode : stdata.sreglocationcode;
    var stu = {
        "民族": stdata.nation,
        "现住址": stdata.sregaddress,
        "学生户籍区域": stdata.stureglocation,
        "成员1姓名": stdata.fname,
        "监护人1户籍与学生同户": stdata.fregsame,
        "监护人1户籍区域": stdata.freglocation,
        "成员2姓名": stdata.sname,
        "监护人2户籍与学生同户": stdata.sregsame,
        "监护人2户籍区域": stdata.sreglocation,
        "房屋产权归属": stdata.whohome,
        "家庭地址": stdata.homeaddress,
        "房屋区域": stdata.homelocation,
        "联系电话": stdata.tel,
        "毕业生区域数据": [stdata.stureglocationcode, stdata.freglocationcode, stdata.sreglocationcode, stdata.homelocationcode]
    }
    mongoose.model('Account').findOne({ wxopenid: openid }, { infoid: 1 }, function (err, doc) {
        if (err) {
            if (err) {
                res.json({ 'error': true, 'message': String(err).replace('ValidationError: ', '') });
                return;
            }
        }
        mongoose.model('StudentInfo').findByIdAndUpdate(doc.infoid, stu, { runValidators: true, upsert: true }, function (err, doc2) {
            if (err) {
                res.json({ 'error': true, 'message': String(err).replace('ValidationError: ', '') });
                return;
            }
            var msg='';
            //var p1 = /叠彩区|七星区|秀峰区|象山区/gi;
            //最特殊情况:无监护人与毕业生同户籍
            if (stdata.fregsame == "" && stdata.sregsame == "") {
                console.log("最特殊的情况，请携带材料到学校咨询认定")
                msg="最特殊的情况，请携带材料到学校咨询认定"
            } else {
                if (/叠彩区|七星区|秀峰区|象山区/gi.test(stdata.stureglocation)) {
                    //console.log("本市四城区户籍");
                    //看房产情况
                    if ((stdata.whohome == "监护人1产权房" || stdata.whohome == "监护人2产权房") && (/叠彩区|七星区|秀峰区|象山区/gi.test(stdata.homelocation))) {
                        //console.log("监护人有产权房在四城区")
                        if (
                            (stdata.whohome == "监护人1产权房" && stdata.fregsame == "是")
                            ||
                            (stdata.whohome == "监护人2产权房" && stdata.sregsame == "是")
                        ) {
                            //产权房所有者与毕业生同户籍
                            console.log("(三一致毕业生，即（学生与法定监护人为同一户籍，户籍与法定监护人自有产权居住房屋所在地一致)1、户口簿首页2、毕业生户口簿信息页3、监护人（房产所有人）及另一监护人户口簿信息页4、房产证")
                            msg="(三一致毕业生，即（学生与法定监护人为同一户籍，户籍与法定监护人自有产权居住房屋所在地一致)1、户口簿首页2、毕业生户口簿信息页3、监护人（房产所有人）及另一监护人户口簿信息页4、房产证"
                        } else {
                            //产权房所有者不与毕业生同户籍
                            console.log("(产权房所有者不与毕业生同户籍)1、毕业生所在户口簿首页2、毕业生户口簿信息页3、与小孩同户的监护人信息页4、与小孩不同户监护人户口簿信息页及首页5、监护人房产证6、房产所有者与小孩及小孩同户的监护人关系证明。（结婚证或者其他）")
                            msg="(产权房所有者不与毕业生同户籍)1、毕业生所在户口簿首页2、毕业生户口簿信息页3、与小孩同户的监护人信息页4、与小孩不同户监护人户口簿信息页及首页5、监护人房产证6、房产所有者与小孩及小孩同户的监护人关系证明。（结婚证或者其他）"
                        }
                    } else {
                        //console.log("监护人无产权房在四城区")
                        if (stdata.whohome == "祖父母或外祖父母产权房") {
                            console.log("(外祖父母产权房就读)1、毕业生所在户口簿首页2、毕业生户口簿信息页3、双方监护人户口簿信息页4、房产证所有人户口信息页5、房产证6、填写房产查询表")
                            msg="(外祖父母产权房就读)1、毕业生所在户口簿首页2、毕业生户口簿信息页3、双方监护人户口簿信息页4、房产证所有人户口信息页5、房产证6、填写房产查询表";
                        } else {
                            //租房
                            console.log("(全家老小都无产权方的)1、户口簿首页2、毕业生户口簿信息页3、双方监护人户口簿信息页4、房东房产证5、租房合同6、填写房产查询表")
                            msg="(全家老小都无产权方的)1、户口簿首页2、毕业生户口簿信息页3、双方监护人户口簿信息页4、房东房产证5、租房合同6、填写房产查询表";
                        }
                    }
                } else {
                    //console.log("非四城户籍");
                    //检查监护人是否有四城区户籍
                    if (
                        (/叠彩区|七星区|秀峰区|象山区/gi.test(stdata.freglocation) && stdata.whohome == "监护人1产权房" && /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.homelocation))
                        ||
                        (/叠彩区|七星区|秀峰区|象山区/gi.test(stdata.sreglocation) && stdata.whohome == "监护人2产权房" && /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.homelocation))
                    ) {
                        console.log("(毕业生非四城区户籍，但随具有四城区户籍监护人实际居住的)")
                        msg="(毕业生非四城区户籍，但随具有四城区户籍监护人实际居住的)";
                    } else {
                        if (
                            (/叠彩区|七星区|秀峰区|象山区/gi.test(stdata.freglocation) || /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.sreglocation))
                            &&
                            /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.homelocation)
                        ) {
                            console.log("(毕业生非四城区户籍，但随具有四城区户籍监护人实际居住的,但房产产权属于非本市户籍的监护人)")
                            msg="(毕业生非四城区户籍，但随具有四城区户籍监护人实际居住的,但房产产权属于非本市户籍的监护人)"
                        } else {
                            console.log("外来务工人员政策就读")
                            msg="外来务工人员政策就读"
                        }
                    }

                }
            }
            //res.json({ 'recordset': doc2 });
            res.json({'recordset':msg});
        })
    })
})

module.exports = router;