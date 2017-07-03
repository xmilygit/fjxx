var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');


router.get('/', function (req, res, next) {
    mongoose.model('Account').find({}, function (err, result) {
        if (err)
            console.log('err:' + err)
        else {
            //console.log(res);
            res.render('admin/index', {
                "title": "网站管理",
                layout: 'f7layoutsmain',
                account: result
            });
        }
    })
})

module.exports = router;