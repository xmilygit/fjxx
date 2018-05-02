$(function() {
    //获取JS-SDK配置信息
    try {
        $.ajax({
            url: svrUrl + '/wechat/jsconfig',
            method: 'GET',
            dataType: 'json',
            data: { debug: false, url: svrUrl + '/wechat/graduate/fenliu', jsapilist: ['hideOptionMenu', 'closeWindow'] },

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

    //获取基础起始数据
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
})

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
    var school = {
        "school1": data.recordset.school1,
        "school2": data.recordset.school2,
        "school3": data.recordset.school3
    }
    myApp.formFromJSON('#form1', school);
}

//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
        //vlistloading = false;
    console.log(data);
}


$$("#save").on('click', function() {
    var stdata = myApp.formToJSON('#form1')
    if (
        (stdata.school1 == stdata.school2 && stdata.school1 != "" && stdata.school2 != "") ||
        (stdata.school1 == stdata.school3 && stdata.school1 != "" && stdata.school3 != "") ||
        (stdata.school2 == stdata.school3 && stdata.school2 != "" && stdata.school3 != "")) {
        myApp.alert('不能重复选择', '提示')
        return;
    }

    myApp.showPreloader('正在保存数据...')
    $.ajax({
        url: svrUrl + "/wechat/graduate/Savefenliu",
        method: 'POST',
        dataType: 'json',
        data: { stdata: JSON.stringify(stdata) },
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

    myApp.alert('保存成功!确定后回到微信界面', "提示", function() {
        wx.closeWindow();
    })

}