
$(function () {
    //获取JS-SDK配置信息
    try {
        $.ajax({
            url: svrUrl + '/wechat/jsconfig',
            method: 'GET',
            dataType: 'json',
            data: { debug: false, url: svrUrl + '/wechat/graduate', jsapilist: ['hideOptionMenu', 'closeWindow'] },

            success: jsconfigSuccess,
            error: ajaxError,
            complete: function () {
                //myApp.hidePreloader();
            }
        })
    } catch (err) {
        //myApp.hidePreloader();
        myApp.alert('系统出错：' + err, "获取JS-SDK出错了!")
    }
    //获取当前系统是否允许编辑毕业生信息
    try {
        $$.ajax({
            url: svrUrl + '/main/getgraduateinfoenable',
            method: 'GET',
            dataType: 'json',
            data: { target: "graduateinfoEnable" },
            success: graduateInfoEnableAS,
            error: ajaxError,
            complete: function () {
                //myApp.hidePreloader();
            }
        })
    } catch (err) {
        //myApp.hidePreloader();
        myApp.alert('系统出错' + err, "出错了！")
    }
})

$("#homeaddress,#homeaddress_tip").on('click', function () {
    myApp.addNotification({
        message: '请务必抄写毕业生所居住房产证上所显示的座落地址，精确到房号',
        title: '注意：',
        closeOnClick: true
        //hold:'5000'
    });
})
$("#sregaddress,#sregaddress_tip").on('click', function () {
    myApp.addNotification({
        message: '请务必抄写毕业生所在户口簿首页上的地址',
        title: '注意：'
        //hold:'5000'
    });
})
$("#fregsame_tip").on('click', function () {
    myApp.addNotification({
        message: '监护人1户籍是否与毕业生在同一户口簿上，绿色表示“是”，灰色表示“否”',
        title: '说明：'
        //hold:'5000'
    });
})
$("#sregsame_tip").on('click', function () {
    myApp.addNotification({
        message: '监护人2户籍是否与毕业生在同一户口簿上，绿色表示“是”，灰色表示“否”',
        title: '说明：'
        //hold:'5000'
    });
})
$("#whohome_tip").on('click', function () {
    myApp.addNotification({
        message: '填写毕业生所居住房产的产权是属于谁的',
        title: '说明：'
        //hold:'5000'
    });
})
//户籍1同册处理事件
$$("#fregsame").on('change', function (obj) {
    var fstate = $("#fregsame").is(':checked') ? true : false;
    //alert(state)
    if (fstate)
        $$("#fregaddress_li").hide();
    else
        $$("#fregaddress_li").show();
})
//户籍2同册处理事件
$$("#sregsame").on('change', function (obj) {
    var sstate = $("#sregsame").is(':checked') ? true : false;
    //alert(state)
    if (sstate)
        $$("#sregaddress_li").hide();
    else
        $$("#sregaddress_li").show();
})
//仅一个监护人处理事件
$$("#onlyone").on('change', function (obj) {
    var sstate = $("#onlyone").is(':checked') ? true : false;
    var sstate2 = $("#sregsame").is(':checked') ? true : false;
    if (sstate) {
        $$("#sname_li").hide();
        $$("#sregsame_li").hide();
        $$("#sregaddress_li").hide();
    } else {
        $$("#sname_li").show();
        $$("#sregsame_li").show();
        $$("#sname").val("");
        if (!sstate2)
            $$("#sregaddress_li").show();
    }
})

$$("stureglocationcode").val("450303000000")
$$("freglocationcode").val("450303000000")
$$("sreglocationcode").val("450303000000")
$$("homelocationcode").val("450303000000")
//区域选择基础部分
var defaultlocation = ["450000000000", "450300000000", "450303000000"];
var lv1 = "[1-9][0-9]0{10}"
var lv2init = "11([0-9][1-9]|[1-9][0-9])0{8}"
var lv3init = "1101([0-9][1-9]|[1-9][0-9])0{6}"
var temppk = [defaultlocation, defaultlocation, defaultlocation, defaultlocation];
//var currentPid="";
function returnLocationArray(regex) {
    var lnames = $.Enumerable.From(locationcode)
        .Where("x=>x.code.match(/" + regex + "/)")
        .OrderBy("x=>x.code")
        .Select("x=>x.locationname")
        .ToArray();
    var lcodes = $.Enumerable.From(locationcode)
        .Where("x=>x.code.match(/" + regex + "/)")
        .OrderBy("x=>x.code")
        .Select("x=>x.code")
        .ToArray();
    return { names: lnames, codes: lcodes };
}
//end//

//学生户籍区域选择器
var locationpick1 = myApp.picker({
    input: '#stureglocation',
    formatValue: function (picker, values, displayValues) {
        //return values[2];
        $$("#stureglocationcode").val(values[2]);
        return displayValues[0] + displayValues[1] + displayValues[2]
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[0]) {
            picker.setValue(temppk[0])
            temppk[0] = null
        }
        //picker.setValue(defaultlocation);
        //picker.setValue(temppk[0])
    },
    cols: [{
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv1).codes, //code,
        displayValues: returnLocationArray(lv1).names, //names,
        onChange: function (picker, value, displayValue) {
            var l1 = value.substr(0, 2);
            var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
            var l2codes = returnLocationArray(l2reg).codes;
            var l2names = returnLocationArray(l2reg).names;
            if (picker.cols[1].replaceValues) {
                picker.cols[1].replaceValues(l2codes, l2names);
            }
            var l2 = l2codes[0].substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}";
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv2init).codes,
        displayValues: returnLocationArray(lv2init).names,
        onChange: function (picker, value, displayValue) {
            var l2 = value.substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv3init).codes,
        displayValues: returnLocationArray(lv3init).names
    }
    ]
});

//监护人1户籍区域选择器
var locationpick2 = myApp.picker({
    input: '#freglocation',
    formatValue: function (picker, values, displayValues) {
        //return values[2];
        $$("#freglocationcode").val(values[2])
        return displayValues[0] + displayValues[1] + displayValues[2]
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[1]) {
            picker.setValue(temppk[1])
            temppk[1] = null
        }
        //picker.setValue(defaultlocation);
        //picker.setValue(temppk[1])
    },
    cols: [{
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv1).codes, //code,
        displayValues: returnLocationArray(lv1).names, //names,
        onChange: function (picker, value, displayValue) {
            var l1 = value.substr(0, 2);
            var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
            var l2codes = returnLocationArray(l2reg).codes;
            var l2names = returnLocationArray(l2reg).names;
            if (picker.cols[1].replaceValues) {
                picker.cols[1].replaceValues(l2codes, l2names);
            }
            var l2 = l2codes[0].substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}";
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv2init).codes,
        displayValues: returnLocationArray(lv2init).names,
        onChange: function (picker, value, displayValue) {
            var l2 = value.substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv3init).codes,
        displayValues: returnLocationArray(lv3init).names
    }
    ]
});

//监护人2户籍区域选择器
var locationpick3 = myApp.picker({
    input: '#sreglocation',
    formatValue: function (picker, values, displayValues) {
        //return values[2];
        $$("#sreglocationcode").val(values[2])
        return displayValues[0] + displayValues[1] + displayValues[2]
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[2]) {
            picker.setValue(temppk[2])
            temppk[2] = null
        }
        //picker.setValue(defaultlocation);
        //picker.setValue(temppk[2])
    },
    cols: [{
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv1).codes, //code,
        displayValues: returnLocationArray(lv1).names, //names,
        onChange: function (picker, value, displayValue) {
            var l1 = value.substr(0, 2);
            var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
            var l2codes = returnLocationArray(l2reg).codes;
            var l2names = returnLocationArray(l2reg).names;
            if (picker.cols[1].replaceValues) {
                picker.cols[1].replaceValues(l2codes, l2names);
            }
            var l2 = l2codes[0].substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}";
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv2init).codes,
        displayValues: returnLocationArray(lv2init).names,
        onChange: function (picker, value, displayValue) {
            var l2 = value.substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv3init).codes,
        displayValues: returnLocationArray(lv3init).names
    }
    ]
});

//房产地址区域选择器
var locationpick4 = myApp.picker({
    input: '#homelocation',
    formatValue: function (picker, values, displayValues) {
        //return values[2];
        $$('#homelocationcode').val(values[2])
        return displayValues[0] + displayValues[1] + displayValues[2]
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[3]) {
            picker.setValue(temppk[3])
            temppk[3] = null
        }
        //picker.setValue(defaultlocation);
        //picker.setValue(temppk[3])
    },
    cols: [{
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv1).codes, //code,
        displayValues: returnLocationArray(lv1).names, //names,
        onChange: function (picker, value, displayValue) {
            var l1 = value.substr(0, 2);
            var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
            var l2codes = returnLocationArray(l2reg).codes;
            var l2names = returnLocationArray(l2reg).names;
            if (picker.cols[1].replaceValues) {
                picker.cols[1].replaceValues(l2codes, l2names);
            }
            var l2 = l2codes[0].substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}";
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv2init).codes,
        displayValues: returnLocationArray(lv2init).names,
        onChange: function (picker, value, displayValue) {
            var l2 = value.substr(0, 4);
            var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
            if (picker.cols[2].replaceValues) {
                picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
            }
        }
    },
    {
        width: 160,
        textAlign: 'left',
        values: returnLocationArray(lv3init).codes,
        displayValues: returnLocationArray(lv3init).names
    }
    ]
});

//根据区域编号计算出picker的相应值 
function getPickerVal(locationcode) {
    var newVal = [];
    var targetVal = locationcode
    var c1 = targetVal.substr(0, 2);
    var c2 = targetVal.substr(0, 4);
    var c3 = targetVal.substr(0, 6);
    newVal = [c1 + '0000000000', c2 + '00000000', c3 + '000000'];
    return newVal;
}

//执行获取毕业生信息激活状态的Ajax的success方法
function graduateInfoEnableAS(data) {
    if (data.recordset) {
        try {
            $.ajax({
                url: svrUrl + "/wechat/graduate/GetInfoById",
                method: 'POST',
                dataType: 'json',
                data: null,
                success: getinfoAjaxSuccess,
                complete: function () {
                    myApp.hidePreloader();
                },
                error: ajaxError
            })
        } catch (err) {
            myApp.alert('系统出错' + err, "出错了")
        }
    } else {
        myApp.hidePreloader();
        myApp.alert('系统已关闭毕业生信息录入,确定后回到微信', '提示', function () {
            //window.location.href = "/wechat/ui";
            wx.closeWindow();
        })
    };
}

function jsconfigSuccess(data) {
    if (data) {
        //alert(JSON.stringify(data))
        wx.config(data);
    } else {
        myApp.alert("出错了!")
    }
}

wx.ready(function () {
    //alert("js接口已准备好")
    wx.hideOptionMenu();
});
wx.error(function (res) {
    myApp.alert(res.errMsg + "-js接口加载失败", "出错了")
})

function getinfoAjaxSuccess(data) {
    if (data.error) {
        myApp.alert(data.message, "出错了")
        return
    }
    var stu = {
        "stuname": data.recordset.姓名,
        "gender": data.recordset.性别,
        "dob": dobformpid(data.recordset.身份证件号),
        "nation": data.recordset.民族,
        "homeaddress": data.recordset.家庭地址,
        "sregaddress": data.recordset.现住址,
        "sid": data.recordset.学籍号,
        "fname": data.recordset.成员1姓名,
        "sname": data.recordset.成员2姓名,
        "tel": data.recordset.联系电话,
        "fregsame": [data.recordset.监护人1户籍与学生同户],
        "sregsame": [data.recordset.监护人2户籍与学生同户],
        "whohome": data.recordset.房屋产权归属,
        "stureglocation": data.recordset.学生户籍区域,
        "freglocation": data.recordset.监护人1户籍区域,
        "sreglocation": data.recordset.监护人2户籍区域,
        "homelocation": data.recordset.房屋区域,
        "locationcodelist": data.recordset.毕业生区域数据,
        "onlyone": [data.recordset.成员2姓名 == '无' ? "是" : "否"]
    }

    if (stu.locationcodelist.length > 0) {
        if (stu.locationcodelist[0] != '') {
            temppk[0] = getPickerVal(stu.locationcodelist[0]);
            $$("#stureglocationcode").val(stu.locationcodelist[0]);
        }
        if (stu.locationcodelist[1] != '') {
            temppk[1] = getPickerVal(stu.locationcodelist[1]);
            $$("#freglocationcode").val(stu.locationcodelist[1]);
        }
        if (stu.locationcodelist[2] != '') {
            temppk[2] = getPickerVal(stu.locationcodelist[2]);
            $$("#sreglocationcode").val(stu.locationcodelist[2]);
        }
        if (stu.locationcodelist[3] != '') {
            temppk[3] = getPickerVal(stu.locationcodelist[3]);
            $$("#homelocationcode").val(stu.locationcodelist[3]);
        }
    }
    if (stu.fregsame == '是') {
        $$("#fregaddress_li").hide();
    }
    if (stu.sregsame == '是') {
        $$("#sregaddress_li").hide();
    }
    if (stu.sname == '无') {
        $$("#sname_li").hide();
        $$("#sregsame_li").hide();
        $$("#sregaddress_li").hide();
    }
    myApp.formFromJSON('#form1', stu);
}

//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
    //vlistloading = false;
    console.log(data);
}

//从身份证中提取出生日期
function dobformpid(pid) {
    return pid.substr(6, 8);
}


$$("#step1save").on('click', function () {
    var stdata = myApp.formToJSON('#form1')
    if (stdata.fregsame.length == 0) {
        stdata.fregsame = ["否"];
    }
    if (stdata.sregsame.length == 0) {
        stdata.sregsame = ["否"];
    }
    if (stdata.onlyone.length == 0) {
        stdata.onlyone = ["否"];
    }
    if (stdata.onlyone == "是" && /监护人2/gi.test(stdata.whohome)) {
        myApp.alert("当无第二监护人时，房屋产权归属不能使用非监护人的住房!", "出错了")
        retrun;
    }

    myApp.showPreloader('正在保存数据...')
    $.ajax({
        url: svrUrl + "/wechat/graduate/SaveInfoByOpenid",
        method: 'POST',
        dataType: 'json',
        data: { stdata: JSON.stringify(stdata) },
        complete: function () {
            myApp.hidePreloader()
        },
        success: saveinfoAjaxSuccess,
        error: ajaxError
    })
})

function saveinfoAjaxSuccess(data) {
    if (data.error) {
        myApp.alert(data.message, "出错了");
        return;
    }
    myApp.showPreloader('正在发送结果')
    $.ajax({
        url: svrUrl + "/wechat/sendtemplate",
        method: 'POST',
        dataType: 'json',
        data: { templateId: "hK0TIi7znV-26YTWtchQgDkA_jBD0hLi0xksT7bxjmQ",msg:data.recordset},
        complete: function () {
            myApp.hidePreloader()
        },
        success: sendtemplateAjaxSuccess,
        error: ajaxError
    })

    //myApp.alert('保存成功!', "提示")
    //myApp.alert(data.recordset,"提示")
    /*
    var popupHTML = '<div class="popup">' +
        '<div class="content-block">' +
        '<p>需要提交以下材料：</p>' +
        data.recordset +
        '<p><a href="#" class="close-popup">知道了</a></p>' +
        '</div>' +
        '</div>'
    myApp.popup(popupHTML);
    */
}

function sendtemplateAjaxSuccess(data){
    if (data.error) {
        myApp.alert(data.message, "出错了");
        return;
    }
    myApp.alert('发送成功!', "提示")
}