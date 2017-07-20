var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

router.get('/infoinput',function(req,res,next){
    res.render('Student/wechat/studentinfoinput',{
        title:'新生学籍信息采集',
        layout:'f7layouts'
    })
})


module.exports = router;