
//ajax执行出错时执行
function ajaxError(data) {
    myApp.alert("系统出错!", "出错了")
    //vlistloading = false;
    console.log(data);
}


$$("#savebutt").on('click', function () {
    var stdata = myApp.formToJSON('#form1')
    myApp.showPreloader('正在查询数据...')
    $.ajax({
        url: svrUrl + "/wechat/stuinfo/querynewstuclassno",
        method: 'POST',
        dataType: 'json',
        data: { stdata: JSON.stringify(stdata) },
        complete: function () {
            myApp.hidePreloader()
        },
        success: saveinfoAjaxSuccess,
        error: ajaxError
    })
})

function saveinfoAjaxSuccess(data) {
    if (data.error) {
        myApp.alert(data.message, "出错了");
        return;
    }
    switch(data.recordset.classno)
    {
        case "1":
        myApp.alert('一（1）班<br>班主任：黄老师', "查询结果")
        break;
        case "2":
        myApp.alert('一（2）班<br>班主任：董老师', "查询结果")
        break;
        case "3":
        myApp.alert('一（3）班<br>班主任：韦老师', "查询结果")
        break;
        case "4":
        myApp.alert('一（4）班<br>班主任：戴老师', "查询结果")
        break
    }
}