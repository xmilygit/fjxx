// Initialize your app
var myApp = new Framework7({
    precompileTemplates: true,
});

// Export selectors engine
var $$ = Dom7;


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    domCache: true,
    dynamicNavbar: true
});


//console.log($.Enumerable.From(locationcode).First("$.locationname=='桂林市'"));
var lv1 = "[1-9][0-9]0{10}"
var lv2init="11([0-9][1-9]|[1-9][0-9])0{8}"
var lv3init="1101([0-9][1-9]|[1-9][0-9])0{6}"
var temppk=[];
function returnLocationArray(regex) {
    var lnames = $.Enumerable.From(locationcode)
        .Where("x=>x.code.match(/" + regex + "/)")
        .OrderBy("x=>x.code")
        .Select("x=>x.locationname")
        .ToArray();
    var lcodes = $.Enumerable.From(locationcode)
        .Where("x=>x.code.match(/" + regex + "/)")
        .OrderBy("x=>x.code")
        .Select("x=>x.code")
        .ToArray();
    return { names: lnames, codes: lcodes };

}

$("#pid").on('blur', function (obj) {
var newVal=[];
        var targetVal = $(this).val()
        var c1 = targetVal.substr(0, 2);
        var c2 = targetVal.substr(0, 4);
        var c3 = targetVal.substr(0, 6);
        newVal=[c1+'0000000000',c2+'00000000',c3+'000000'];
    if ($("#locationcode1").val().length == 0) {
        locationpick1.setValue(newVal)
        temppk[0]=newVal;
    }
    if ($("#locationcode2").val().length == 0) {
        locationpick2.setValue(newVal)
        temppk[1]=newVal;
    }
    if ($("#locationcode3").val().length == 0) {
        locationpick2.setValue(newVal)
        temppk[2]=newVal;
    }
    if ($("#locationcode4").val().length == 0) {
        locationpick2.setValue(newVal)
        temppk[3]=newVal;
    }
})


var locationpick1 = myApp.picker({
    input: '#locationcode1',
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText:'确定',
    onOpen: function (picker) {
        if (temppk[0]) {
            picker.setValue(temppk[0])
            temppk[0] = null
        }
    },
    cols: [
        {
            width: 160,
            textAlign: 'left',
            values:returnLocationArray(lv1).codes,//code,
            displayValues: returnLocationArray(lv1).names,//names,
            onChange: function (picker, value, displayValue) {
                var l1 = value.substr(0, 2);
                var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
                if (picker.cols[1].replaceValues) {
                    picker.cols[1].replaceValues(returnLocationArray(l2reg).codes, returnLocationArray(l2reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv2init).codes,
            displayValues: returnLocationArray(lv2init).names,
            onChange: function (picker, value, displayValue) {
                var l2 = value.substr(0, 4);
                var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
                if (picker.cols[2].replaceValues) {
                    picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv3init).codes,
            displayValues: returnLocationArray(lv3init).names
        }
    ]
});

var locationpick2 = myApp.picker({
    input: '#locationcode2',
    //rotateEffect: true,
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText:'确定',
    onOpen: function (picker) {
        if (temppk[1]) {
            picker.setValue(temppk[1])
            temppk[1] = null
        }
    },
    cols: [
        {
            width: 160,
            textAlign: 'left',
            values:returnLocationArray(lv1).codes,//code,
            displayValues: returnLocationArray(lv1).names,//names,
            onChange: function (picker, value, displayValue) {
                var l1 = value.substr(0, 2);
                var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
                if (picker.cols[1].replaceValues) {
                    picker.cols[1].replaceValues(returnLocationArray(l2reg).codes, returnLocationArray(l2reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv2init).codes,
            displayValues: returnLocationArray(lv2init).names,
            onChange: function (picker, value, displayValue) {
                var l2 = value.substr(0, 4);
                var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
                if (picker.cols[2].replaceValues) {
                    picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv3init).codes,
            displayValues: returnLocationArray(lv3init).names
        }
    ]
});

var locationpick3 = myApp.picker({
    input: '#locationcode3',
    //rotateEffect: true,
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText:'确定',
    onOpen: function (picker) {
        if (temppk[2]) {
            picker.setValue(temppk[2])
            temppk[2] = null
        }
    },
    cols: [
        {
            width: 160,
            textAlign: 'left',
            values:returnLocationArray(lv1).codes,//code,
            displayValues: returnLocationArray(lv1).names,//names,
            onChange: function (picker, value, displayValue) {
                var l1 = value.substr(0, 2);
                var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
                if (picker.cols[1].replaceValues) {
                    picker.cols[1].replaceValues(returnLocationArray(l2reg).codes, returnLocationArray(l2reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv2init).codes,
            displayValues: returnLocationArray(lv2init).names,
            onChange: function (picker, value, displayValue) {
                var l2 = value.substr(0, 4);
                var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
                if (picker.cols[2].replaceValues) {
                    picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv3init).codes,
            displayValues: returnLocationArray(lv3init).names
        }
    ]
});

var locationpick4 = myApp.picker({
    input: '#locationcode4',
    //rotateEffect: true,
    formatValue: function (picker, values) {
        return values[2];
    },
    toolbarCloseText:'确定',
    onOpen: function (picker) {
        if (temppk[3]) {
            picker.setValue(temppk[3])
            temppk[3] = null
        }
    },
    cols: [
        {
            width: 160,
            textAlign: 'left',
            values:returnLocationArray(lv1).codes,//code,
            displayValues: returnLocationArray(lv1).names,//names,
            onChange: function (picker, value, displayValue) {
                var l1 = value.substr(0, 2);
                var l2reg = l1 + "([0-9][1-9]|[1-9][0-9])0{8}"
                if (picker.cols[1].replaceValues) {
                    picker.cols[1].replaceValues(returnLocationArray(l2reg).codes, returnLocationArray(l2reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv2init).codes,
            displayValues: returnLocationArray(lv2init).names,
            onChange: function (picker, value, displayValue) {
                var l2 = value.substr(0, 4);
                var l3reg = l2 + "([0-9][1-9]|[1-9][0-9])0{6}"
                if (picker.cols[2].replaceValues) {
                    picker.cols[2].replaceValues(returnLocationArray(l3reg).codes, returnLocationArray(l3reg).names);
                }
            }
        },
        {
            width: 160,
            textAlign: 'left',
            values: returnLocationArray(lv3init).codes,
            displayValues: returnLocationArray(lv3init).names
        }
    ]
});