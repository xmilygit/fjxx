var express = require('express');
var router = express.Router();
var passport=require('passport');

router.get('/',function(req,res,next){
    res.render('index',{title:'aaaaaa'});
});
router.get('/test',function(req,res,next){
    res.render('test',{title:'aaaaaa'});
})

router.post(
    '/login',
    
    passport.authenticate('local',{session:false},
    function(req,res){
        res.redirect('/');
    })
    
    /*
    function(req,res,next){
        req.flash('error',['测试错误信息','error2','error3']);
        res.redirect('/');
    }
    */
)
module.exports=router;