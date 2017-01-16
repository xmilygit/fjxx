var mongoose=require('mongoose');
var AccountSchema=new mongoose.Schema({
    username:String,
    password:String,
    gender:String,
    pid:String,
    dob:String,
    wxopenid:String
},{collection:'Account'});

mongoose.model('Account',AccountSchema);