var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto=require('crypto');


router.get('/',function(req,res,next){
    res.render('admin/index',{
        "title":"网站管理",
        layout:'f7layoutsmain'
    });
})

module.exports=router;