// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
});
// Export selectors engine
var $$ = Dom7;
$(function () {
    try {
        $.ajax({
            url: svrUrl + '/wechat/jsconfig',
            method: 'GET',
            dataType: 'json',
            data: {debug:false,url:'http://home.tunnel.echomod.cn/test/testjssdk',jsapilist:['hideOptionMenu','chooseImage']},
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
    alert("js接口已准备好")
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


$$("#can").on('click',function(){
    alert('click')
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            alert(res.localIds)
            console.log(res.localIds)
            //$$("#img").src='https://www.baidu.com/img/bd_logo1.png';
             $$("#img").prop('src', res.localIds)
        }
    });
    
})

