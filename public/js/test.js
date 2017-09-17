// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
});
$(function () {
    try {
        $.ajax({
            url: svrUrl + '/wechat/jsconfig',
            method: 'GET',
            dataType: 'json',
            data: {debug:false,url:'http://fjxx.tunnel.echomod.cn/test/testjssdk',jsapilist:['hideOptionMenu']},
            success: jsconfigSuccess,
            error: ajaxError,
            complete: function () {
                myApp.hidePreloader();
            }
        })
    } catch (err) {
        myApp.hidePreloader();
        myApp.alert(err, "出错了!")
    }    
});

function jsconfigSuccess(data) {
    if (data) {
        //alert(data)
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
    alert("js接口加载失败" + res)
})

//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
    //vlistloading = false;
    console.log(data);
}
