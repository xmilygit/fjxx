$(function() {
    //获取JS-SDK配置信息
    try {
        $.ajax({
            url: svrUrl + '/wechat/jsconfig',
            method: 'GET',
            dataType: 'json',
            data: { debug: false, url: svrUrl + '/wechat/graduate/dispresult?openid=' + $("#openid").val(), jsapilist: ['hideOptionMenu', 'closeWindow'] },

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

    try {
        $.ajax({
            url: svrUrl + "/wechat/graduate/GetInfoByOpenId",
            method: 'POST',
            dataType: 'json',
            data: { openid: $("#openid").val() },
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


//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
        //vlistloading = false;
    console.log(data);
}


function getinfoAjaxSuccess(data) {
    if (data.error) {
        myApp.alert(data.message, "出错了")
        return
    }
    var msg = data.recordset.材料.replace(/\n/gi, "<br>");
    $$("#msg").html(msg)
}

$$("#save").on('click', function() {
    wx.closeWindow();
})