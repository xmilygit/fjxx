/*
var lv1 = "[1-9][0-9]0{10}"
var lv2init = "11([0-9][1-9]|[1-9][0-9])0{8}"
var lv3init = "1101([0-9][1-9]|[1-9][0-9])0{6}"
var temppk = [];
var currentPid="";
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
*/
//学生身份证设置为禁用后，该功能取消
/*
$("#pid").on('blur', function (obj) {
    var newVal = [];
    var targetVal = $(this).val()
    var c1 = targetVal.substr(0, 2);
    var c2 = targetVal.substr(0, 4);
    var c3 = targetVal.substr(0, 6);
    newVal = [c1 + '0000000000', c2 + '00000000', c3 + '000000'];
    if ($("#locationcode1").val().length == 0) {
        locationpick1.setValue(newVal)
        temppk[0] = newVal;
    }
    if ($("#locationcode2").val().length == 0) {
        locationpick2.setValue(newVal)
        temppk[1] = newVal;
    }
    if ($("#locationcode3").val().length == 0) {
        locationpick3.setValue(newVal)
        temppk[2] = newVal;
    }
    if ($("#locationcode4").val().length == 0) {
        locationpick4.setValue(newVal)
        temppk[3] = newVal;
    }
})
*/



$(function() {
        //获取JS-SDK配置信息
        try {
            $.ajax({
                url: svrUrl + '/wechat/jsconfig',
                method: 'GET',
                dataType: 'json',
                data: { debug: false, url: svrUrl + '/wechat/graduate', jsapilist: ['hideOptionMenu', 'closeWindow'] },

                success: jsconfigSuccess,
                error: ajaxError,
                complete: function() {
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
                complete: function() {
                    //myApp.hidePreloader();
                }
            })
        } catch (err) {
            //myApp.hidePreloader();
            myApp.alert('系统出错' + err, "出错了！")
        }
    })
    //户籍1同册处理事件
$$("#fregsame").on('change', function(obj) {
        var fstate = $("#fregsame").is(':checked') ? true : false;
        //alert(state)
        if (fstate)
            $$("#fregaddress_li").hide();
        else
            $$("#fregaddress_li").show();
    })
    //户籍2同册处理事件
$$("#sregsame").on('change', function(obj) {
    var sstate = $("#sregsame").is(':checked') ? true : false;
    //alert(state)
    if (sstate)
        $$("#sregaddress_li").hide();
    else
        $$("#sregaddress_li").show();
})

var lv1 = "[1-9][0-9]0{10}"
var lv2init = "11([0-9][1-9]|[1-9][0-9])0{8}"
var lv3init = "1101([0-9][1-9]|[1-9][0-9])0{6}"
//var temppk = [];
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

var locationpick1 = myApp.picker({
    input: '#picker-custom-toolbar',
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText: '确定',
    //onOpen: function (picker) {
    //    if (temppk[0]) {
    //        picker.setValue(temppk[0])
    //        temppk[0] = null
    //    }
    //},
    cols: [
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv1).codes,//code,
            displayValues: returnLocationArray(lv1).names,//names,
            onChange: function (picker, value, displayValue) {
                var l1 = value.substr(0, 2);
                var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
                if (picker.cols[1].replaceValues) {
                    picker.cols[1].replaceValues(returnLocationArray(l2reg).codes, returnLocationArray(l2reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv2init).codes,
            displayValues: returnLocationArray(lv2init).names,
            onChange: function (picker, value, displayValue) {
                alert('asdfaf')
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
                complete: function() {
                    myApp.hidePreloader();
                },
                error: ajaxError
            })
        } catch (err) {
            myApp.alert('系统出错' + err, "出错了")
        }
    } else {
        myApp.hidePreloader();
        myApp.alert('系统已关闭毕业生信息录入,确定后回到微信', '提示', function() {
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

wx.ready(function() {
    //alert("js接口已准备好")
    wx.hideOptionMenu();
});
wx.error(function(res) {
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
        "dob": dobformpid(data.recordset.身份证件号), // data.recordset.出生日期||dobformpid(data.recordset.身份证件号),
        "nation": data.recordset.民族,
        "homeaddress": data.recordset.家庭地址,
        "regaddress": data.recordset.现住址,
        //"origin": data.recordset.籍贯,
        "sid": data.recordset.学籍号,
        "fname": data.recordset.成员1姓名,
        "sname": data.recordset.成员2姓名,
        "tel": data.recordset.联系电话,
        //"onlychild": [data.recordset.是否独生子女],
        //"preschool": [data.recordset.是否受过学前教育],
        //"regtype": data.recordset.户口性质,
        //"borncode": data.recordset.出生地行政区划代码,
        //"regcode": data.recordset.户口所在地行政区划,
        //"zipcode": data.recordset.邮政编码
    }
    var fs = {
            //"fname": data.recordset.成员1姓名,
            //"frelationship": data.recordset.成员1关系,
            //"Fguardian": [data.recordset.成员1是否监护人],
            //"fhomeaddress": data.recordset.成员1现住址,
            //"fregcode": data.recordset.成员1户口所在地行政区划,
            //"ftel": data.recordset.成员1联系电话,
            //"sname": data.recordset.成员2姓名,
            //"srelationship": data.recordset.成员2关系,
            //"sguardian": [data.recordset.成员2是否监护人],
            //"shomeaddress": data.recordset.成员2现住址,
            //"sregcode": data.recordset.成员2户口所在地行政区划,
            //"stel": data.recordset.成员2联系电话
            //"tel": data.recordset.联系电话
        }
        /*
            var pickerVal = stu.pid.substr(0,6)+'000000';
            if (stu.borncode === "" || !stu.borncode){
                stu.borncode = pickerVal;
                temppk[0]=getPickerVal(pickerVal)
            }else{
                temppk[0]=getPickerVal(stu.borncode)
            }
            if (stu.regcode === ""|| !stu.regcode){
                stu.regcode = pickerVal;
                temppk[1]=getPickerVal(pickerVal)
            }else{
                temppk[1]=getPickerVal(stu.regcode)
            }
            if (fs.fregcode === ""||!fs.fregcode){
                fs.fregcode = pickerVal;
                temppk[2]=getPickerVal(pickerVal)
            }else{
                temppk[2]=getPickerVal(fs.fregcode)
            }
            if (fs.sregcode === ""||!fs.sregcode){
                fs.sregcode = pickerVal;
                temppk[3]=getPickerVal(pickerVal)
            }else{
                temppk[3]=getPickerVal(fs.sregcode)
            }
        */
    myApp.formFromJSON('#form1', stu)
        //myApp.formFromJSON('#form2', fs)

    //var dob = stu.dob.substr(0, 4) + "-" + stu.dob.substr(5, 2) + "-" + stu.dob.substr(6, 2);
    //calendarDateFormat.value = [dob]
    //$('#pid').trigger("blur");
    //alert(data.recordset.成员2联系电话)
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


$$("#savebutt").on('click', function() {
    var stdata = myApp.formToJSON('#form1')
    var fsdata = myApp.formToJSON('#form2')
        /*
        var stu = {
            "姓名":stdata.stuname,
            "性别":stdata.gender,
            "出生日期":stdata.dob,
            "民族":stdata.nation,
            "家庭地址":stdata.homeaddress,
            "现住址":stdata.regaddress,
            "籍贯":stdata.origin,
            "身份证件号":stdata.pid,
            "是否独生子女":stdata.onlychild[0]|"否",
            "是否受过学前教育":stdata.preschool[0]|"否",
            "户口性质":stdata.regtype,
            "出生地行政区划代码":stdata.borncode,
            "户口所在地行政区划":stdata.regcode,
            "邮政编码":stdata.zipcode,
            "成员1姓名":fsdata.fname,
            "成员1关系":fsdata.frelationship,
            "成员1是否监护人":fsdata.Fguardian[0]|"否",
            "成员1现住址":fsdata.fhomeaddress,
            "成员1户口所在地行政区划":fsdata.fregcode,
            "成员1联系电话":fsdata.ftel,
            "成员2姓名":fsdata.sname,
            "成员2关系":fsdata.srelationship,
            "成员2是否监护人":fsdata.sguardian[0]|"否",
            "成员2现住址":fsdata.shomeaddress,
            "成员2户口所在地行政区划":fsdata.sregcode,
            "成员2联系电话":fsdata.stel
        }
        */
    myApp.showPreloader('正在保存数据...')
    $.ajax({
        url: svrUrl + "/wechat/stuinfo/SaveInfoByOpenid",
        method: 'POST',
        dataType: 'json',
        data: { stdata: JSON.stringify(stdata), fsdata: JSON.stringify(fsdata) },
        complete: function() {
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
    myApp.alert('保存成功!', "提示")
}