// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
    swipePanel: 'left'
    //template7Pages: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    domCache: true,
    dynamicNavbar: true
});


//定义日期控件的配置变量
/*
var calendarconfig = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    toolbarCloseText: "Ok",
}
*/

//日期控件
/*
var calendarRange1 = myApp.calendar({
    input: '#calendar-default',
    monthNames: calendarconfig.monthNames,
    monthNamesShort: calendarconfig.monthNamesShort,
    dayNames: calendarconfig.dayNames,
    dayNamesShort: calendarconfig.dayNamesShort,
    toolbarCloseText: "Ok",
    rangePicker: true
});
*/

var year = moment().year();
var month = ((moment().month() + 1)) < 10 ? "0" + (moment().month() + 1) : moment().month() + 1;
var day = moment().date() < 10 ? "0" + moment().date() : moment().date();
console.log(year + "年" + month + "月" + day + "日")


//教师用户列表的模板初始化
//var shtmlTAcc = $$("#teacherlist").html(),
//    phtmlTAcc = Template7.compile(shtmlTAcc);

//$$(document).on('pageInit', function (e) {
//
//});

//新增用户表单验证设置
$("#acc-inst-form").validate({
    rules: {
        username: {
            required: true,
            rangelength: [2, 8],
            CVonlychinese: true
        },
        pid: {
            required: true,
            CVpid: true
        },
        password: {
            required: true,
            rangelength: [6, 16]
        },
        cfgpassword: {
            equalTo: '#addpassword',
            CVpassword: true
        }
    },
    messages: {
        username: {
            required: '用户名必须填写',
            rangelength: '用户最少含有2个字符，最多8个字符'
        },
        pid: {
            required: "身份证必须填写"
        },
        password: {
            required: "密码必须填写"
        },
        cfgpassword: "两次输入的密码不一致"
    },
    errorClass: 'errorcss'
    /*,
    showErrors: function (errorMap, errorList) {
        var errstr = '';
        for (i in errorList) {
            errstr += "<li>"+errorList[i].message+"</   li>";
        }
        myApp.addNotification({
            title: '所填写数据中有 ' + this.numberOfInvalids() + ' 个错误',
            message: "<ol style='display:block;'>"+errstr+"</ol>"
        });
    }
    */
})
//重置密码表单验证
$("#acc-rstpw-form").validate({
    rules: {
        password: {
            required: true,
            CVpassword: true
        },
        cfgpassword: {
            equalTo: '#rstpassword'
        }
    },
    messages: {
        password: {
            required: "密码必须填写"
        },
        cfgpassword: "两次输入的密码不一致"
    },
    errorClass: 'errorcss'
})
//新增用户表单验证设置
$("#acc-modi-form").validate({
    rules: {
        username: {
            required: true,
            rangelength: [2, 8],
            CVonlychinese: true
        },
        pid: {
            required: true,
            CVpid: true
        }
    },
    messages: {
        username: {
            required: '用户名必须填写',
            rangelength: '用户最少含有2个字符，最多8个字符'
        },
        pid: {
            required: "身份证必须填写"
        }
    },
    errorClass: 'errorcss'
})

//重置密码的按钮被点击时执行
$$("#accrstpwButt").on('click',function(){
    if($("#acc-rstpw-form").valid()){
        myApp.showPreloader('正在处理...')
        var npw=$("#rstpassword").val();
        var accid=$("#accid").val();
        try{
            $$.ajax({
                url:svrUrl+"/main/rstpw",
                method:'POST',
                dataType:'json',
                data:{npw:npw,id:accid},
                complete:function(){
                    myApp.hidePreloader();
                },
                success:accrstpwAjaxSucc,
                error:ajaxError
            })
        }catch(err){
            myApp.alert('系统错误','出错了')
        }
    }
})

//重置密码AJAX执行完成SUCCESS后执行
function accrstpwAjaxSucc(data){
    if(data.error)
        myApp.alert(data.message,'出错了');
    else
        myApp.closeModal('.accrstpw')
}

//新增用户保存按钮被点击时执行
//需要将cfgpassword从表单数据中移除，以免被存入数据库
$$("#accAddButt").on('click', function () {
    if ($("#acc-inst-form").valid()) {
        myApp.showPreloader('正在处理...')
        var formData = myApp.formToJSON('#acc-inst-form');
        //alert(JSON.stringify(formData));
        //return
        //var account = {};
        //account.username = $("#addusername").val();
        //account.pid = $("#addpid").val();
        //account.dob = $("#adddob").val();
        //account.gender = $("#addgender").val();
        try {
            $$.ajax({
                url: svrUrl + "/main/insertacc",
                method: 'POST',
                dataType: 'json',
                data: formData,
                complete: function () {
                    myApp.hidePreloader();
                },
                success: accinstAjaxSucc,
                error: ajaxError
            })
        } catch (err) {
            myApp.hidePreloader();
            myApp.alert(err, '错误！')
        }
    }
})

//新增用户时AJAX执行成功success后执行
function accinstAjaxSucc(data) {
    if (data.error)
        myApp.alert(data.message, '出错了');
    else {
        if (vlistloadfinished)
            myList.appendItem(data.doc);
        myApp.closeModal('.addAccInfo')
    }
}
//修改用户时AJAX执行成功SUCCESS后执行
function accmodiAjaxSucc(data) {
    //更新列表
    if (data.error)
        myApp.alert(data.message, '出错了');
    else
        myList.replaceItem(parseInt($("#vindex").val()), data.doc);
    myApp.closeModal('.modiAccInfo')
}
//修改用户保存按钮被点击时执行
$$("#accSaveButt").on('click', function () {
    if ($("#acc-modi-form").valid()) {
        myApp.showPreloader('正在处理...')
        var account = myList.items[parseInt($("#vindex").val())];
        var formData = myApp.formToJSON('#acc-modi-form');
        account.username = formData.username;//$("#username").val();
        account.pid = formData.pid;//$("#pid").val();
        account.dob = formData.dob;//$("#dob").val();
        account.gender = formData.gender; //$("#gender").val();
        console.log(account)
        try {
            $$.ajax({
                url: svrUrl + "/main/updateacc",
                data: account,
                method: 'POST',
                dataType: 'json',
                complete: function () {
                    //关闭加载图标
                    myApp.hidePreloader();
                },
                success: accmodiAjaxSucc,
                error: ajaxError
            })
        } catch (err) {
            myApp.alert(err, '出错了');
        }
    }
})

//虚拟列表模板
function renderVlistItem(index, item) {
    var wx = '';
    if (item.wxopenid)
        wx = '已绑定微信';
    return '<li class="swipeout accordion-item">' +
        '<input type="hidden" value="' + index + '" />' +
        //'<input type="hidden" value="' + item._id + '" />' +
        '<a href="#" class="swipeout-content item-content item-link">' +
        '<div class="item-inner">' +
        '<div class="item-title">' + item.username + '</div>' +
        '<div class="item-after">' + wx + '</div>' +
        '</div>' +
        '</a>' +
        '<div class="accordion-item-content">' +
        '<div class="content-block">' +
        '<p>身份证：' + item.pid + '</p>' +
        '<p>性别：' + item.gender + '</p>' +
        '<p>出生日期：' + item.dob + '</p>' +
        '</div>' +
        '</div>' +
        '<div class="swipeout-actions-right">' +
        '<a href="#" class="resetpassword bg-yellow">重置密码</a>' +
        (wx == '' ? '' : '<a href="#" class="unbind bg-blue">解除绑定</a>') +
        '<a href="#" class="modi bg-orange">修改</a>' +
        //`'<a href="#" class="swipeout-delete" data-confirm-title="删除确认" data-confirm="确认要删除该记录吗？">删除</a>' +`
        '<a href="#" class="delete bg-red">删除</a>' +
        '</div>' +
        '</li>';
}

//初始化虚拟列表 
var vlistloading = false;
var myList = null;
var vlistlastid = null;
var vlistloadfinished = false;
var keyword='';
function vlistInit() {
    keyword=$(".mysearchbutton").parent('div').children('input').val()||''
    var pagesize = 20;
    vlistloading = true;
    $$.ajax({
        //url: svrUrl + "/main/getaccountlist",
        //data: { pagesize: pagesize, lastid: vlistlastid },
        url:svrUrl+"/main/usersearch",
        data:{pagesize:pagesize,lastid:vlistlastid,keyword:keyword},
        method: 'GET',
        dataType: 'json',
        complete: function () {
            vlistloading = false;
        },
        success: accountsAjaxSuccess,
        error: ajaxError
    })
}
//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
    //vlistloading = false;
    console.log(data);
}
//当获取用户数据的AJAX执行成功success后执行
function accountsAjaxSuccess(data) {
    if (data.error) {
        myApp.alert(data.message, "出错了")
    } else {
        if(data.recordset.getDate<=0){
            myApp.alert('没有找到任何数据','提示');
            vlistloadfinished=true;//解决当查询不到任何数据时的添加用户行为添加成功后不追加到列表中的问题
            $$('#userlistInfinite .infinite-scroll-preloader').hide();
            return;
        }
        if (!myList) {
            myList = myApp.virtualList('#vuserlist', {
                items: data.recordset.getDate,
                //template: vlisthtml,
                //renderItem: function (index, item) {
                //    return renderVlistItem(index, item)
                //},
                renderItem: renderVlistItem,
                onItemsAfterInsert: vlistAfterInsert,
                cache:false                
            });
        } else
            myList.appendItems(data.recordset.getDate);

        vlistlastid = myList.items[myList.currentToIndex]._id

        if (myList.items.length >= data.recordset.getCount) {
            vlistloadfinished = true;
            // 加载完毕，则注销无限加载事件，以防不必要的加载
            myApp.detachInfiniteScroll($$('#userlistInfinite'));
            // 删除加载提示符
            $$('#userlistInfinite .infinite-scroll-preloader').hide();
            return;
        }
    }

}
//当vuserlist虚拟列表渲染完成后执行
function vlistAfterInsert(a, b) {
    $$('#vuserlist .modi').on('click', function () {
        var $li = $(myApp.swipeoutOpenedEl)
        var index = parseInt($li.children('input').val());
        var account = myList.items[index];
        //$.Enumerable.From(myList.items).First("$._id==='"+id+"'");
        //.Where("$._id=='"+id+"'")
        //.ToArray();
        //alert(item.username)
        //$("#username").val(account.username)
        //$("#pid").val(account.pid)
        //$("#dob").val(account.dob)
        //$("#gender").val(account.gender)
        $("#vindex").val(index)

        myApp.formFromJSON('#acc-modi-form', account);
        myApp.popup('.modiAccInfo')
    });
    $$("#vuserlist .resetpassword").on('click', function () {
        var $li = $(myApp.swipeoutOpenedEl)
        var index = parseInt($li.children('input').val());
        var account = myList.items[index];
        $("#accid").val(account._id)
        myApp.popup('.accrstpw');
    })
    $$("#vuserlist .unbind").on('click', function () {
        myApp.confirm('请确认是否要解除该用户的绑定状态', '确认操作', function () {
            var index = $(myApp.swipeoutOpenedEl).children('input').val();
            var id = myList.items[index]._id;
            myApp.showPreloader('正在处理...')
            try {
                $$.ajax({
                    url: svrUrl + '/main/unbinder',
                    method: 'GET',
                    dataType: 'json',
                    data: { id: id },
                    complete: function () {
                        myApp.hidePreloader();
                    },
                    success: function (data) {
                        if (data.error) {
                            myApp.alert(data.message, "出错了");
                            return;
                        }
                        myList.replaceItem(index, data.recordset);
                    },
                    error: ajaxError
                })
            } catch (err) {
                myApp.alert(err, "出错了");
            }
        })
    })
    $$("#vuserlist .delete").on('click', function () {
        myApp.confirm('请确认是否执行删除操作','确认操作',function () {
            var index = $(myApp.swipeoutOpenedEl).children('input').val();
            var id = myList.items[index]._id;
            myApp.showPreloader('正在处理...')
            try {
                $$.ajax({
                    url: svrUrl + '/main/delacc',
                    method: 'GET',
                    dataType: 'json',
                    data: { id: id },
                    complete: function () {
                        myApp.hidePreloader();
                    },
                    success: function (data) {
                        if (data.error) {
                            myApp.alert(data.message, "出错了");
                            return;
                        }
                        myList.deleteItem(parseInt(index));
                    },
                    error: ajaxError
                })
            } catch (err) {
                myApp.alert(err, "出错了");
            }
        })
    })
}
$$(document).on('pageInit', function (e) {
    // Do something here when page loaded and initialized
    console.log(e.detail.page.name)
})
//新生信息录入状态页面打开时初始化
myApp.onPageInit('stateinfomng', function (e) {    
    myApp.showPreloader("正在初始数据...");
    try {
        $$.ajax({
            url: svrUrl + '/main/GetAllOnOffFun',
            method: 'GET',
            dataType: 'json',
            data:{},
            success: StateInfoEnableAS,
            error: ajaxError,
            complete: function () {
                myApp.hidePreloader();
            }
        })
    } catch (err) {
        myApp.hidePreloader();
        myApp.alert(err,"出错了！")
    }
})
//执行获取新生信息激活状态的Ajax的success方法
function StateInfoEnableAS(data){
    var state=data.recordset;
    $("#newstuinput").attr("checked",state.newstudentinfoEnable);
    $("#graduateinput").attr("checked",state.graduateinfoEnable);
}
myApp.onPageInit('userlist', function (page) {
    vlistInit();
})
//用户虚拟列表的滚动加载 
$$("#userlistInfinite").on("infinite", function () {
    if (vlistloading) return
    vlistloading = true;
    vlistInit(); 
});
//调试时用
//vlistInit();
//用户虚拟列表的自定义搜索功能
$$("#userSearch").on("click", function () {
    //当搜索按钮被点击时需要重置无限滚动的相关参数
    //删除虚拟列表的原有数据
    myList.deleteAllItems();
    //重新注册无限滚动事件
    myApp.attachInfiniteScroll($$('#userlistInfinite'));
    //加载中...的图标显示出来
    $$('#userlistInfinite .infinite-scroll-preloader').show();
    //加载完成的变量进行重置
    vlistloadfinished = false;
    //最后一条记录的变量进行重置
    vlistlastid = null;
    vlistInit();
    /*
    var keyword=($(this).parent('div').children('input').val());
    try{
    myApp.showPreloader('正在搜索...');
    $$.ajax({
        url:svrUrl+"/main/usersearch",
        method:'GET',
        dataType:'json',
        data:{keyword:keyword},
        complete:function(){
            myApp.hidePreloader();
        },
        success:dispUSRes,
        error:ajaxError
    })
    }catch(err){
        myApp.alert('系统出错','出错了')
    }
    */
})


//myApp.onPageReinit('newstuinfomng', function (page) {
//    alert('adfadfs')
//})

//当新生信息录入状态改变时
$$("#newstuinput").on("change",function(){
    //alert($("#newstuinput").is(':checked'))
    var state=$("#newstuinput").is(':checked')?true:false;
    myApp.showPreloader("正在保存...");
    try {
        $$.ajax({
            url: svrUrl + '/main/setnewstuinfoenable',
            method: 'GET',
            dataType: 'json',
            data:{'state':state},
            success: function setNewStuInfoEnableAS(data){
                
            },
            error: ajaxError,
            complete: function () {
                myApp.hidePreloader();
            }
        })
    } catch (err) {
        myApp.hidePreloader();
        myApp.alert(err,"出错了！")
    }
})

//当毕业生信息录入状态改变时
$$("#graduateinput").on("change",function(){
    //alert($("#newstuinput").is(':checked'))
    var state=$("#graduateinput").is(':checked')?true:false;
    myApp.showPreloader("正在保存...");
    try {
        $$.ajax({
            url: svrUrl + '/main/SetOnOffFun',
            method: 'GET',
            dataType: 'json',
            data:{'state':state,'target':'graduateinfoEnable'},
            success: function setNewStuInfoEnableAS(data){
                
            },
            error: ajaxError,
            complete: function () {
                myApp.hidePreloader();
            }
        })
    } catch (err) {
        myApp.hidePreloader();
        myApp.alert(err,"出错了！")
    }
})
//设置新生信息录入状态ajax success方法


//搜索用户列表的AJAX执行成功success的方法
function dispUSRes(data){
    if(data.error){
        myApp.alert(data.message,'出错了');
        return;
    }
    myList.replaceAllItems(data.recordset);
}


var common = {
    initTab1Calendar: function () {
        //tab1的日期控件
        var calendarRange = myApp.calendar({
            input: '#calendar-range',
            monthNames: calendarconfig.monthNames,
            monthNamesShort: calendarconfig.monthNamesShort,
            dayNames: calendarconfig.dayNames,
            dayNamesShort: calendarconfig.dayNamesShort,
            toolbarCloseText: "Ok",
            rangePicker: true
        });
    }
}