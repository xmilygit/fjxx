var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */


router.get('/test', function (req, res, next) {
  res.render('Account/test2');
})
router.get('/:id',function(req,res,next){
  mongoose.model('Account').findById(mongoose.mongo.ObjectID(req.id),function(err,obe){
    if(err){
      console.log(err.message);
    }else{
      console.log(obe);
    }
  })
})
router.get('/', function (req, res, next) {
  /*
  mongoose.model('Account').create({
    name: 'xmily',
    sex: '男',
    pid:'450205198008141012',
    bron:'1981-09-21',
    wxopenid:'xxxxx'
  }, function (err, ac) {
    if (err) {
      res.send("There was a problem adding the infomation to the database.")
    } else {
      console.log('POST creating new blob:' + ac);
      //res.end()
    }
  })
  */
  mongoose.model('Account').find({}, function (err, Accounts) {
    if (err) {
      return console.log(err);
    } else {
      res.format({
        html: function () {
          res.render('Account/index', { title: '用户列表', "Accounts": Accounts });
        }
      })
    }
  })
})

module.exports = router;
