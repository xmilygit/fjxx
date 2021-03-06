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

$("#teacher-form").validate({
    rules: {
        username: {
            required: true,
            rangelength: [2, 8],
            CVonlychinese: true
        },
        password: {
            required: true,
            rangelength: [6, 6]
        }
    },
    messages: {
        username: {
            required: "姓名必须填写",
            rangelength: '用户最少含有2个字符，最多8个字符'
        },

        password: {
            required: "密码必须填写",
            rangelength: "密码位数只能是6位"
        }
    },
    errorClass: 'errorcss'
})

$("#newstudent-form").validate({
    rules: {
        username: {
            required: true,
            rangelength: [2, 8],
            CVonlychinese: true
        },
        password: {
            required: true,
            rangelength: [6, 6]
        }
    },
    messages: {
        username: {
            required: "姓名必须填写",
            rangelength: '用户最少含有2个字符，最多8个字符'
        },

        password: {
            required: "密码必须填写",
            rangelength: "密码位数只能是6位"
        }
    },
    errorClass: 'errorcss'
})

$("#student-form").validate({
    rules: {
        username: {
            required: true,
            rangelength: [2, 8],
            CVonlychinese: true
        },
        password: {
            required: true,
            rangelength: [6, 6]
        }
    },
    messages: {
        username: {
            required: "姓名必须填写",
            rangelength: '用户最少含有2个字符，最多8个字符'
        },

        password: {
            required: "密码必须填写",
            rangelength: "密码位数只能是6位"
        }
    },
    errorClass: 'errorcss'
})

$$("#tBinderButt").on('click', function () {
    if ($("#teacher-form").valid()) {
        var formData = myApp.formToJSON('#teacher-form');
        myApp.showPreloader('正在处理...')
        try {
            $$.ajax({
                url: svrUrl + "/wechat/binder/teacher",
                method: 'POST',
                dataType: 'json',
                data: formData,
                complete: function () {
                    myApp.hidePreloader();
                },
                success: tbinderAjaxSucc,
                error: ajaxError
            })
        } catch (err) {
            myApp.alert(err, '出错了');
        }
        console.log(formData)
    }
})

$$("#nsBinderButt").on('click', function () {
    if ($("#newstudent-form").valid()) {
        var formData = myApp.formToJSON('#newstudent-form');
        myApp.showPreloader('正在处理...')
        try {
            $$.ajax({
                url: svrUrl + "/wechat/binder/teacher",
                method: 'POST',
                dataType: 'json',
                data: formData,
                complete: function () {
                    myApp.hidePreloader();
                },
                success: tbinderAjaxSucc,
                error: ajaxError
            })
        } catch (err) {
            myApp.alert(err, '出错了');
        }
        console.log(formData)
    }
})

$$("#sBinderButt").on('click', function () {
    if ($("#student-form").valid()) {
        var formData = myApp.formToJSON('#student-form');
        myApp.showPreloader('正在处理...')
        try {
            $$.ajax({
                url: svrUrl + "/wechat/binder/teacher",
                method: 'POST',
                dataType: 'json',
                data: formData,
                complete: function () {
                    myApp.hidePreloader();
                },
                success: tbinderAjaxSucc,
                error: ajaxError
            })
        } catch (err) {
            myApp.alert(err, '出错了');
        }
        console.log(formData)
    }
})


//执行教师用户绑定成功success时执行
function tbinderAjaxSucc(result) {
    if (result.error) {
        myApp.alert(result.message, '错误');
        return;
    }
    if (result.recordset) {
        myApp.alert('绑定成功，确定后将跳转到对应页面', '提示', function () {
            location.reload()
        });
    }
    else
        myApp.alert('该用户不存在', '错误')
}

//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
    //vlistloading = false;
    console.log(data);
}

/*
$(function(){
    try{
        $.ajax({
            url:svrUrl+'/wechat/jsconfig',
            method:'GET',
            dataType:'json',
            data: {
                debug:true,
                //url:'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxba8db6584881bbab&redirect_uri=http%3A%2F%2Ffjxx.tunnel.echomod.cn%2Fwechat%2Fbinder%2F&response_type=code&scope=snsapi_base&state=123',
                url:'http://fjxx.tunnel.echomod.cn/wechat/binder',
                jsapilist:['hideOptionMenu']},
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
    myApp.alert("js接口加载失败"+JSON.parse(res),"出错了")
})
*/