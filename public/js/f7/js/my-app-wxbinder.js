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
            rangelength: [6]
        }
    },
    messages: {
        required: "姓名必须填写",
        rangelength: '用户最少含有2个字符，最多8个字符'
    },
    password: {
        required: "密码必须填写"
    },
    errorClass: 'errorcss'
})

$$("#tBinderButt").on('click',function(){
    if($("#teacher-form").valid()){
        
    }
})