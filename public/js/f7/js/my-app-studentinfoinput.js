// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
});

// Export selectors engine
var $$ = Dom7;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    domCache: true,
    dynamicNavbar: true
});
myApp.showPreloader('正在加载数据...')

//console.log($.Enumerable.From(locationcode).First("$.locationname=='桂林市'"));
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

//根据lesspid计算出picker的相应值 
function getPickerVal(lesspid){
    var newVal = [];
    var targetVal = lesspid
    var c1 = targetVal.substr(0, 2);
    var c2 = targetVal.substr(0, 4);
    var c3 = targetVal.substr(0, 6);
    newVal = [c1 + '0000000000', c2 + '00000000', c3 + '000000'];
    return newVal;
}


var locationpick1 = myApp.picker({
    input: '#locationcode1',
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[0]) {
            picker.setValue(temppk[0])
            temppk[0] = null
        }
    },
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

var locationpick2 = myApp.picker({
    input: '#locationcode2',
    //rotateEffect: true,
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[1]) {
            picker.setValue(temppk[1])
            temppk[1] = null
        }
    },
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

var locationpick3 = myApp.picker({
    input: '#locationcode3',
    //rotateEffect: true,
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[2]) {
            picker.setValue(temppk[2])
            temppk[2] = null
        }
    },
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

var locationpick4 = myApp.picker({
    input: '#locationcode4',
    //rotateEffect: true,
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText: '确定',
    onOpen: function (picker) {
        if (temppk[3]) {
            picker.setValue(temppk[3])
            temppk[3] = null
        }
    },
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



$(function () {
    //获取当前系统是否允许编辑新生学籍信息
    try {
        $$.ajax({
            url: svrUrl + '/main/getnewstuinfoenable',
            method: 'GET',
            dataType: 'json',
            data: {},
            success: NewStuInfoEnableAS,
            error: ajaxError,
            complete: function () {
                myApp.hidePreloader();
            }
        })
    } catch (err) {
        myApp.hidePreloader();
        myApp.alert(err, "出错了！")
    }

    //执行获取新生信息激活状态的Ajax的success方法
    function NewStuInfoEnableAS(data) {
        if (data.recordset) {
            try {
                $.ajax({
                    url: svrUrl + "/wechat/stuinfo/GetInfoById",
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
                myApp.alert(err, "出错了")
            }
        } else {
            myApp.alert('系统已关闭新生学籍信息录入,确定后跳转到首页', '提示', function () {
                window.location.href="/wechat/ui";
            })
        };
    }

    try{
        $.ajax({
            url:svrUrl+'/wechat/jsconfig',
            method:'GET',
            dataType:'json',
            data: {debug:false,url:'http://fjxx.tunnel.echomod.cn/wechat/stuinfo',jsapilist:['hideOptionMenu']},
            success:jsconfigSuccess,
            error:ajaxError,
            complete:function(){
                myApp.hidePreloader();
            }
        })
    }catch(err){
        myApp.hidePreloader();
        myApp.alert(err,"出错了!")
    }
})
function jsconfigSuccess(data){
    if(data){
        //alert(data)
        wx.config(data);
    }else{
        myApp.alert("出错了!")
    }
}
wx.ready(function () {
    //alert("js接口已准备好")
    wx.hideOptionMenu();
});
wx.error(function(res){
    alert("js接口加载失败"+res)
})
function getinfoAjaxSuccess(data) {
    if (data.error) {
        myApp.alert(data.message, "出错了")
        return
    }
    var stu = {
        "stuname": data.recordset.姓名,
        "gender": data.recordset.性别,
        "dob": data.recordset.出生日期||dobformpid(data.recordset.身份证件号),
        "nation": data.recordset.民族,
        "homeaddress": data.recordset.家庭地址,
        "regaddress": data.recordset.现住址,
        "origin": data.recordset.籍贯,
        "pid": data.recordset.身份证件号,
        "onlychild": [data.recordset.是否独生子女],
        "preschool": [data.recordset.是否受过学前教育],
        "regtype": data.recordset.户口性质,
        "borncode": data.recordset.出生地行政区划代码,
        "regcode": data.recordset.户口所在地行政区划,
        "zipcode": data.recordset.邮政编码
    }
    var fs = {
        "fname": data.recordset.成员1姓名,
        "frelationship": data.recordset.成员1关系,
        "Fguardian": [data.recordset.成员1是否监护人],
        "fhomeaddress": data.recordset.成员1现住址,
        "fregcode": data.recordset.成员1户口所在地行政区划,
        "ftel": data.recordset.成员1联系电话,
        "sname": data.recordset.成员2姓名,
        "srelationship": data.recordset.成员2关系,
        "sguardian": [data.recordset.成员2是否监护人],
        "shomeaddress": data.recordset.成员2现住址,
        "sregcode": data.recordset.成员2户口所在地行政区划,
        "stel": data.recordset.成员2联系电话
    }

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

    myApp.formFromJSON('#form1', stu)
    myApp.formFromJSON('#form2', fs)

    var dob = stu.dob.substr(0, 4) + "-" + stu.dob.substr(5, 2) + "-" + stu.dob.substr(6, 2);
    calendarDateFormat.value = [dob]
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
function dobformpid(pid){
    return pid.substr(6,8);
}

//定义日期控件的配置变量

var calendarconfig = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    toolbarCloseText: "Ok",
}

var calendarDateFormat = myApp.calendar({
    input: '#dob',
    dateFormat: 'yyyymmdd',
    monthNames: calendarconfig.monthNames,
    monthNamesShort: calendarconfig.monthNamesShort,
    dayNames: calendarconfig.dayNames,
    dayNamesShort: calendarconfig.dayNamesShort,
    toolbarCloseText: "Ok"
});


$$("#savebutt").on('click', function () {
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
    myApp.alert('保存成功!', "提示")
}