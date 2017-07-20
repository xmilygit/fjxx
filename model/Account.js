var mongoose=require('mongoose');
var AccountSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'用户名必须填写']
    },
    password:String,
    gender:String,
    pid:{
        type:String,
        validate:{
            validator:function(v){
                return /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(v)
            },
            message:'身份证不符合要求'
        }
    },
    dob:String,
    infoid:String,
    fname:String,
    sname:String,
    ftel:String,
    stel:String,
    wxopenid:String
},{collection:'Account'});

mongoose.model('Account',AccountSchema);