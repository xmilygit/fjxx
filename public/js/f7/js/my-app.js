// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
    swipePanel: 'left',
    domCache: true
    //template7Pages: true
});

// Export selectors engine
var $$ = Dom7;

//定义AJAX服务器地址
var svrUrl = "http://192.168.123.110:3000";
// Add view
//var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
//    dynamicNavbar: true
//});


//定义日期控件的配置变量
var calendarconfig = {
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
    dayNames: ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    toolbarCloseText: "Ok",
}

//日期控件
var calendarRange1 = myApp.calendar({
    input: '#calendar-default',
    monthNames: calendarconfig.monthNames,
    monthNamesShort: calendarconfig.monthNamesShort,
    dayNames: calendarconfig.dayNames,
    dayNamesShort: calendarconfig.dayNamesShort,
    toolbarCloseText: "Ok",
    rangePicker: true
});

var year = moment().year();
var month = ((moment().month() + 1)) < 10 ? "0" + (moment().month() + 1) : moment().month() + 1;
var day = moment().date() < 10 ? "0" + moment().date() : moment().date();
console.log(year + "年" + month + "月" + day + "日")


//上机记录列表的模板初始化
//var shtmlRecord = $$("#template1").html(),
//    phtmlRecord = Template7.compile(shtmlRecord);;
//    alert(shtmlRecord)

var loading = false;

function loaddata() {
    let daterange = $$("#calendar-default").val() || year + "-01-01" + " - " + year + "-" + month + "-" + day;
    let pcname = $$("#pcname").val() || "";
    let pagesize = 10
    let currentcount = $$('#listOfRecord li').length;
    let currentpage = currentcount / pagesize;
    currentpage = currentpage + 1;

    $$.ajax({
        url: svrUrl + "/pclog",
        data: { daterange: daterange, pcname: pcname, pagesize: pagesize, currentpage: currentpage },
        method: 'GET',
        dataType: 'json',
        complete: function () {
            loading = false;
        },
        success: function (data) {
            if (data.type == 'error') {
                myApp.alert(data.message, "出错了")
            } else {
                $$("#listOfRecord ul").append(phtmlRecord({
                    reco: data.recordset
                }))
                /*
                if (currentpage == 1)
                    $$("#counttitle").html(daterange + "共找到" + data.recordset[1][0].recosum + "条逾期记录");
                
                if (currentpage * pagesize >= data.recordset[1][0].recosum) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    myApp.detachInfiniteScroll($$('.infinite-scroll'));
                    // 删除加载提示符
                    $$('.infinite-scroll-preloader').hide();
                    return;
                }
                */
                loading = false;
            }

        },
        error: function (data) {
            myApp.alert("系统出错!", "出错了")
            loading = false;
            console.log(data);
        }
    })
}

//点击查看按钮获取数据时
$$('#viewrecord').on('click', function () {
    
    $$("#listOfRecord ul").html("");
    //注册无限加载事件
    myApp.attachInfiniteScroll($$('.infinite-scroll'))
    // 加载提示符
    $$('.infinite-scroll-preloader').show();
    loaddata();
});

$$(".infinite-scroll").on("infinite", function () {
    if (loading) return
    loading = true;
    loaddata()
})


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