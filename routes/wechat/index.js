var express = require('express');
var async = require('async')
var request = require('request');
var mongoose = require('mongoose');
var crypto = require('crypto');
var varmange = require('../../model/varmange')
var router = express.Router();


router.get('/',function(req,res,next){
    var openid=req.session.openid;
    res.render('wechat/index', {
        title: '桂林市凤集小学',
        layout: 'f7layoutsbase',
        openid: openid
    })
})

module.exports = router;