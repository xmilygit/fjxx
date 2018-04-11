var mongoose = require('mongoose');
var TempSchema = new mongoose.Schema({
    "姓名" : String,
    "户口所在地" : String,
    "家庭详细地址" : String
}, { collection: 'temp' });
mongoose.model('temp', TempSchema);