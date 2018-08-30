var mongoose=require('mongoose');
var Stu2018Schema=new mongoose.Schema({
    name:String,
    classno:String,
    sex:String
},{collection:'stu2018'});

mongoose.model('stu2018',Stu2018Schema);