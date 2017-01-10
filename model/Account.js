var mongoose=require('mongoose');
var AccountSchema=new mongoose.Schema({
    name:String,
    sex:String,
    pid:String,
    bron:String,
    wxopenid:String
},{collection:'Account'});

mongoose.model('Account',AccountSchema);