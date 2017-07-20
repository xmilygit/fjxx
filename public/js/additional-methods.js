jQuery.validator.addMethod('CVonlychinese',function(value,element,parm){
    var reg=/^[\u4e00-\u9fa5]*$/;
    return reg.test(value);
},"只能输入中文字符");

jQuery.validator.addMethod('CVpassword',function(value,element){
    var reg=/^(?:\d+|[a-zA-Z]+|[_!@#$%^&*]+){6,15}$/;
    return reg.test(value);
},"密码必须由字母数字及符号组成长度介于6-16个字符");

jQuery.validator.addMethod('CVpid',function(value,element){
    var reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return reg.test(value);
},"请输入正确的身份证号码")