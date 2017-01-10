var mongoose=require('mongoose');
var AccountSchema=new mongoose.Schema({
    name:String,
    sex:String,
    pid:String,
    bron:String,
    wxopenid:String
});

mongoose.model('Account',AccountSchema);