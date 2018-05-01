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
    if (req.session.openid) {
        res.render('graduate/wechat/infoinput', {
            title: '毕业生信息采集',
            layout: 'f7layoutsbase'
        })
    } else {
        res.render('wechat/error', {
            layout: null
        })
    }
})

router.get('/querypid', function (req, res, next) {
    res.render('graduate/wechat/queryPid', {
        title: '毕业生无房信息查询采集',
        layout: 'f7layoutsbase'
    })
})

router.post('/SavePidsByOpenid', function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var openid = req.session.openid;//"o_BZpuDFj3Gi-psvtFFDRgl9id-0";//
    var stdata = JSON.parse(req.body.stdata);

    mongoose.model('Account').findOne({ wxopenid: openid }, { infoid: 1 }, function (err, doc) {
        if (err) {
            if (err) {
                res.json({ 'error': true, 'message': String(err).replace('ValidationError: ', '') });
                return;
            }
        }
        mongoose.model('StudentInfo').findByIdAndUpdate(doc.infoid, { '无房查询': [stdata.fname, stdata.fpid, stdata.mname, stdata.mpid] }, { runValidators: true, upsert: true }, function (err, doc2) {
            if (err) {
                res.json({ 'error': true, 'message': String(err).replace('ValidationError: ', '') });
                return;
            }
        })
        res.json({ error: null, 'message': 'ok' });
    })
})
router.post('/GetInfoById', function (req, res, next) {
    //console.log(req.session.openid)
    res.setHeader("Access-Control-Allow-Origin", "*");
    var openid = req.session.openid;//"o_BZpuDFj3Gi-psvtFFDRgl9id-0";//req.session.openid;//
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
    var openid = req.session.openid;//"o_BZpuDFj3Gi-psvtFFDRgl9id-0";//req.session.openid;//
    var stdata = JSON.parse(req.body.stdata);
    stdata.freglocation = stdata.fregsame == "是" ? stdata.stureglocation : stdata.freglocation;
    stdata.sreglocation = stdata.sregsame == "是" ? stdata.stureglocation : stdata.sreglocation;
    stdata.freglocationcode = stdata.fregsame == "是" ? stdata.stureglocationcode : stdata.freglocationcode;
    stdata.sreglocationcode = stdata.sregsame == "是" ? stdata.stureglocationcode : stdata.sreglocationcode;
    if (stdata.onlyone == "是") {
        stdata.sname = "无";
        stdata.sreglocation = "广西桂林市叠彩区";
        stdata.sreglocationcode = "450303000000";
        stdata.sregsame = "否";
    }
    
    var stypedesc = "";
    var queryhome=false;
    var msg = '';
    var onlyone = stdata.onlyone == "是" ? true : false;
    var stulocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.stureglocation);
    var flocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.freglocation);
    if (!onlyone)
        var slocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.sreglocation);
    var hlocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.homelocation);
    var fregsame = stdata.fregsame == "是" ? true : false;
    if (!onlyone)
        var sregsame = stdata.sregsame == "是" ? true : false;

    if (
        //以下三种情况少见，无法证明关系，现实中“投亲”这一类型大致像这种情况
        //一个监护人的情况下学校四城区也没有监护人与学生同一个户籍
        (onlyone && stulocal && !fregsame)
        ||
        //两个家长与四城区户籍的学生都不在同一个户籍上
        (!onlyone && stulocal && !fregsame && !sregsame)
        ||
        //两个家长与外市户籍的学生都不在同一个户籍上
        (!onlyone && !stulocal && !fregsame && !sregsame)
    ) {
        console.log("最特殊的情况，请携带材料到学校咨询认定")
        msg = "特殊的情况，无任何监护人与毕业生同一户口本，请携带材料到学校咨询认定"
        stypedesc = "特殊的情况"
    } else {
        //if (/叠彩区|七星区|秀峰区|象山区/gi.test(stdata.stureglocation)) {
        if (stulocal) {
            //console.log("毕业生本市四城区户籍");
            //看房产情况
            switch (stdata.whohome) {
                case "监护人1产权房":
                case "监护人2产权房":
                    var homename1 = stdata.whohome.replace('产权房', '');
                    var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                    var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                    if ((fregsame && homename1 == "监护人1") || (sregsame && homename1 == "监护人2")) {
                        msg = "1、毕业生所在户口簿；\n\r" +
                            "2、" + homename1 + "(" + homename2 + ")的房产证；"
                    } else {
                        msg = "1、毕业生所在户口簿；\n\r" +
                            "2、" + homename1 + "(" + homename2 + ")的房产证；\n\r" +
                            "3、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")与毕业生（或与毕业生同户籍的另一监护人（" + homename3 + "））的关系证明；\n\r\n\r" +
                            "注意：如果监护人之间已离异所提供的所有材料只能是离婚协议上所指定监护人的材料。"
                    }
                    stypedesc = "生市区户，有监护人市区户，有房产";
                    break;
                case "监护人1名下单位集资房":
                case "监护人2名下单位集资房":
                    var homename1 = stdata.whohome.replace('名下单位集资房', '');
                    var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                    var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                    if ((fregsame && homename1 == "监护人1") || (sregsame && homename1 == "监护人2")) {
                        msg = "1、毕业生所在户口簿；\n\r" +
                            "2、" + homename1 + "(" + homename2 + ")的集资房协议；\n\r" +
                            "3、集资房购房发票；"
                    } else {
                        msg = "1、毕业生所在户口簿；\n\r" +
                            "2、" + homename1 + "(" + homename2 + ")的集资房协议；\n\r" +
                            "3、集资房购房发票；\n\r" +
                            "4、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")与毕业生（或与毕业生同户籍的另一监护人（" + homename3 + "））的关系证明；\n\r\n\r" +
                            "注意：如果监护人之间已离异所提供的所有材料只能是离婚协议上所指定监护人的材料。"
                    }
                    stypedes = "生市区户，有监护人市区户，有单位集资房房产"
                    break;
                case "祖父母或外祖父母产权房":
                    msg = "1、毕业生所在户口簿；\n\r" +
                        "2、" + stdata.whohome + "的房产证(房产所有人须与毕业生同一户口簿)；\n\r" +
                        "3、请填写房产情况查询表";
                    stypedesc = "生市区户，有监护人市区户，无房产，祖(外祖)父母房产，查无房";
                    queryhome=true;
                    break;
                case "监护人1名义租房":
                case "监护人2名义租房":
                    var homename1 = stdata.whohome.replace('名义租房', '');
                    var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                    var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                    msg = "1、毕业生所在户口簿；\n\r" +
                        "2、房东房产证；\n\r" +
                        "3、" + homename1 + "(" + homename2 + ")与房东签订的租房合同；\n\r";
                    if ((fregsame && homename1 == "监护人1") || (sregsame && homename1 == "监护人2")) {
                        msg += "4、请填写房产情况查询表";
                    } else {
                        msg += "4、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")" + "与毕业生（或与毕业生同户籍的另一监护人(" + homename3 + ")）的关系证明；\n\r" +
                            "5、请填写房产情况查询表\n\r\n\r" +
                            "注意：如果监护人之间已离异所提供的所有材料只能是离婚协议上所指定监护人的材料。";
                    }
                    stypedesc = "生市区户，有监护人市区户，全家无房产，租房，查无房";
                    queryhome=true;
                    break;
                case "监护人1名下单位房":
                case "监护人2名下单位房":
                    var homename1 = stdata.whohome.replace('名下单位房', '');
                    var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                    var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                    msg = "1、毕业生所在户口簿；\n\r";
                    msg += "2、" + homename1 + "(" + homename2 + ")所在单位开具的居住单位房的相关证明；\n\r";
                    if ((fregsame && homename1 == "监护人1") || (sregsame && homename1 == "监护人2")) {

                        msg += "3、请填写房产情况查询表"
                    } else {
                        msg += "3、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")" + "与毕业生（或与毕业生同户籍的另一监护人(" + homename3 + ")）的关系证明；\n\r" +
                            "4、请填写房产情况查询表" +
                            "\n\r\n\r注意：如果监护人之间已离异所提供的所有材料只能是离婚协议上所指定监护人的材料。"
                    }
                    stypedesc = "生市区户，有监护人市区户，无房产，单位房，查无房";
                    queryhome=true;
                    break;
                case "监护人1名下公租房（租约房）或廉租房":
                case "监护人2名下公租房（租约房）或廉租房":
                    var homename1 = stdata.whohome.replace('名下公租房（租约房）或廉租房', '');
                    var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                    var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                    msg = "1、毕业生所在户口簿；\n\r";
                    msg += "2、" + homename1 + "(" + homename2 + ")持有的公租房（租约房）或廉租房的相关证本；\n\r";
                    if ((fregsame && homename1 == "监护人1") || (sregsame && homename1 == "监护人2")) {

                        msg += "3、请填写房产情况查询表"
                    } else {
                        msg += "3、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")" + "与毕业生（或与毕业生同户籍的另一监护人(" + homename3 + ")）的关系证明；\n\r" +
                            "4、请填写房产情况查询表" +
                            "\n\r\n\r注意：如果监护人之间已离异所提供的所有材料只能是离婚协议上所指定监护人的材料。"
                    }
                    stypedesc = "生市区户，有监护人市区户，无房产，公租房（租约房）或廉租房，查无房";
                    queryhome=true;
                    break;
            }
        } else {
            //console.log("非四城户籍");
            //检查监护人是否有四城区户籍\检查学生是否是雁册户籍
            flocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.freglocation);
            if (!onlyone)
                slocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.sreglocation);
            hlocal = /叠彩区|七星区|秀峰区|象山区/gi.test(stdata.homelocation);
            if ((flocal || slocal) && hlocal) {
                //检查房产情况，只能是产权房和外祖父母房（前提是监护人从未迁出）
                switch (stdata.whohome) {
                    case "监护人1产权房":
                    case "监护人2产权房":
                        var homename1 = stdata.whohome.replace('产权房', '');
                        var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                        var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                        var homename4 = homename1 == "监护人1" ? "监护人2" : "监护人2"
                        if ((homename1 == "监护人1" && fregsame) || (homename1 == "监护人2" && sregsame)) {
                            msg = "1、毕业生所在户口簿；\n\r" +
                                "2、" + homename4 + "(" + homename3 + ")的户口簿；\n\r" +
                                "3、" + homename1 + "(" + homename2 + ")的房产证；\n\r" +
                                "4、结婚证或者其他能证明" + homename4 + "(" + homename3 + ")" + "与毕业生（或与毕业生同户籍的另一监护人（" + homename2 + "））的关系证明；";
                        } else {
                            msg = "1、毕业生所在户口簿；\n\r" +
                                "2、" + homename1 + "(" + homename2 + ")的户口簿；\n\r" +
                                "3、" + homename1 + "(" + homename2 + ")的房产证；\n\r" +
                                "4、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")" + "与毕业生（或与毕业生同户籍的另一监护人（" + homename3 + "））的关系证明；\n\r";
                        }
                        stypedesc = "生外来户籍，随市区户籍监护人居住，有产权房"
                        break;
                    case "监护人1名下单位集资房":
                    case "监护人2名下单位集资房":
                        var homename1 = stdata.whohome.replace('名下单位集资房', '');
                        var homename2 = homename1 == "监护人1" ? stdata.fname : stdata.sname;
                        var homename3 = homename1 == "监护人1" ? stdata.sname : stdata.fname;
                        var homename4 = homename1 == "监护人1" ? "监护人2" : "监护人2"
                        if ((homename1 == "监护人1" && fregsame) || (homename1 == "监护人2" && sregsame)) {
                            msg = "1、毕业生所在户口簿；\n\r" +
                                "2、" + homename4 + "(" + homename3 + ")的户口簿；\n\r" +
                                "3、" + homename1 + "(" + homename2 + ")的集资房协议；\n\r" +
                                "4、集资房购房发票；\n\r" +
                                "5、结婚证或者其他能证明" + homename4 + "(" + homename3 + ")" + "与毕业生（或与毕业生同户籍的另一监护人（" + homename2 + "））的关系证明；";
                        } else {
                            msg = "1、毕业生所在户口簿；\n\r" +
                                "2、" + homename1 + "(" + homename2 + ")的户口簿；\n\r" +
                                "3、" + homename1 + "(" + homename2 + ")的集资房协议；\n\r" +
                                "4、集资房购房发票；\n\r" +
                                "5、结婚证或者其他能证明" + homename1 + "(" + homename2 + ")" + "与毕业生（或与毕业生同户籍的另一监护人（" + homename3 + "））的关系证明；";
                        }
                        stypedesc = "生外来户籍，随市区户籍监护人居住，有单位集资房"
                        break;
                    case "祖父母或外祖父母产权房":
                        msg = "1、毕业生所在户口簿；\n\r";
                        if (flocal) {
                            //监护人1是本地
                            msg += "2、" + stdata.whohome + "的房产证(监护人1[" + stdata.fname + "]的户籍落户房产所有人户口上，且从未迁出)；\n\r" +
                                "3、结婚证或者其他能证明监护人1(" + stdata.fname + ")与毕业生（或与毕业生同户籍的另一监护人（" + stdata.sname + "））的关系证明；\n\r";
                        } else {
                            //监护人2是本地
                            msg += "2、" + stdata.whohome + "的房产证(监护人2[" + stdata.sname + "]的户籍落户房产所有人户口上，且从未迁出)；\n\r" +
                                "3、结婚证或者其他能证明监护人2(" + stdata.sname + ")与毕业生（或与毕业生同户籍的另一监护人（" + stdata.fname + "））的关系证明；\n\r";
                        }
                        msg += "4、请填写房产情况查询表";
                        stypedesc = "生外来户籍，随市区户籍监护人居住，无房，市区户籍监护人从未迁出"
                        queryhome=true;
                        break;
                    default:
                        msg = "毕业生是非本市户籍时，当前所选择的房屋产权归属类型不能做为符合条件的依据，请准备好材料到校咨询";
                        stypedesc = "生外来户籍，随市区户籍监护人居住，无房，此类无法认定"
                        break;
                }
            } else {
                //纯外来人员
                var lingui = /临桂/gi.test(stdata.stureglocation);
                if (!lingui) {
                    msg = "1、外来人员就读子女户口簿;\n\r" +
                        "2、《广西壮族自治区居住证》（截止 2018 年 6 月 30 日，时间在 1 年以上(含一年)，且在有效期内。下同）;\n\r" +
                        "3、法定监护人在流入地已取得 1 年以上（含 1 年）合法稳定住所证明材料：房产证、购房合同（附购房发票和完税凭证）、房屋租赁合同（附出租人的房产证和房屋租赁完税凭证或发票）等任何一项;\n\r" +
                        "4、法定监护人具有 1 年以上（含 1 年）合法稳定的职业证明材料：流入地工商营业执照、纳税证明、国家规定的企事业单位劳动用工合同等任何一项\n\r\n\r"+
                        "注意：毕业学校仅收“居住证”进行审查，其他材料请务必准备好等学校通知，由市教育局组织初中进行审核。";
                    stypedesc = "外来务工人员"
                } else {
                    msg = "1、外来人员就读子女户口簿;\n\r" +
                        "2、《广西壮族自治区居住证》\n\r" +
                        "3、法定监护人在流入地已取得 1 年以上（含 1 年）合法稳定住所证明材料：房产证、购房合同（附购房发票和完税凭证）、房屋租赁合同（附出租人的房产证和房屋租赁完税凭证或发票）等任何一项;\n\r" +
                        "4、法定监护人具有 1 年以上（含 1 年）合法稳定的职业证明材料：流入地工商营业执照、纳税证明、国家规定的企事业单位劳动用工合同等任何一项/n/r/n/r";
                        "注意：毕业学校仅收“居住证”进行审查，其他材料请务必准备好等学校通知，由市教育局组织初中进行审核。";
                    stypedesc = "临桂区籍外来人员"
                }
            }

        }
    }

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
        "毕业生区域数据": [stdata.stureglocationcode, stdata.freglocationcode, stdata.sreglocationcode, stdata.homelocationcode],
        "stypedesc":stypedesc,
        "材料":msg
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

            //res.json({ 'recordset': doc2 });
            res.json({ 'recordset': msg,'queryhome':queryhome });
        })
    })
})

module.exports = router;