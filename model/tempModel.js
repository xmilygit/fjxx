var mongoose = require('mongoose');
var TempSchema = new mongoose.Schema({
    "房产情况": String,
    "姓名": String,
    "性别": String,
    "民族": String,
    "出生年月": String,
    "父亲姓名": String,
    "母亲姓名": String,
    "户口所在地及性质": String,
    "户主": String,
    "家庭详细住址": String,
    "房产所有人": String
}, { collection: 'temp' });
mongoose.model('temp', TempSchema);