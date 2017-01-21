var express = require('express');
var router = express.Router();
var passport=require('passport');

router.get('/',function(req,res,next){
    //console.log(req.user);
    res.render('index',{
        title:'aaaaaa',
        layout:'amazelayouts',
        user:req.user
    });
});
router.get('/test',function(req,res,next){
    data = {
        menuData: {
            "theme": "dropdown1",
            "options": {
                "cols": "1",
                "toggleIcon": "list"
            },
            "content": [
                {
                    "link": "##",
                    "title": "公司",
                    "subCols": 2,
                    "channelLink": "进入栏目 &raquo;",
                    "subMenu": [
                        {
                            "link": "##",
                            "title": "公司"
                        },
                        {
                            "link": "##",
                            "title": "人物"
                        }
                    ]
                }
            ]
        },
        headerData:{
            "theme":"default",
            "options":{
                "fixed": true
            },
            "content":{
                "left":[
                    {
                        "link":"",
                        "icon":"home"
                    }
                ],
                "title":"FJXX",
                "right":[
                    {
                        "link":"",
                        "icon":"user"
                    },
                    {
                        "link":"",
                        "icon":"bars"
                    }
                ]
            }
        },
        accordionData: {
          "theme": "basic",
          "content": [
            {
              "title": "标题一",
              "content": "内容一",
              "active": true
            },
            {
              "title": "标题二",
              "content": "内容二"
            },
            {
              "title": "标题三",
              "content": "内容三"
            }
          ]
        }
    };

    res.render('index3',{
        title:'aaaaaa',
        layout: false,
        accordionData:data.accordionData,
        headerData:data.headerData,
        menuData:data.menuData
    });
})

router.get('/widgetbasic',function(req,res,next){
    res.render('widgetbasic',{layout:false});
})
router.get('/widget',function(req,res,next){
    res.render('widget',{layout:false});
})

router.post('/login',    
    passport.authenticate('local',{failureRedirect:'/',failureFlash: true}),
    function(req,res){
        res.redirect('/');
    }
)

router.get('/logout',
    function(req,res){
        req.logout();
        res.redirect('/');
    }
)
module.exports=router;