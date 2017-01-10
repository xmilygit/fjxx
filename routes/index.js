var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/Account', function (req, res, next) {
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
