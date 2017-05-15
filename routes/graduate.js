var express = require('express');
var async = require('async')
var request=require('request');
var router = express.Router();



var myauth = {
    appid: 'wxba8db6584881bbab',
    appsecret: '7d234a1b76eb803e6683d3a8945985bb',
    token: 'xmilyhh'
};

router.get('/',function(req,res,next){
    let code=req.query['code'];
    let url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+myauth.appid+"&secret="+myauth.appsecret+"&code="+code+"&grant_type=authorization_code "
let useropenid='';
request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('打印结果：'+JSON.parse(body).openid) // 打印google首页
    console.log(body)
    useropenid=JSON.parse(body).openid;
    res.render('graduate/index',{
        title:'桂林市凤集小学--毕业生信息管理系统',
        layout:'f7layouts',
        useropenid:useropenid,
        code:req.query['code']
    });
  }else{
      console.log('获取用户openid出错：'+error);
      res.end();
  }
})    
    
    
});


module.exports=router;