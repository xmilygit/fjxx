var mongoose = require('mongoose');
var StudentEduInfoSchema = new mongoose.Schema({
    "stuname": {
        type: String,
        required: [true, '姓名必须填写']
    },
    "gender": {
        type: String,
        required: [true, '性别必须填写']
    },
    "dob": {
        type: String,
        required: [true, '出生日期必须填写']
    },
    "pid": {
        type: String,
        required: [true, '身份证件号必须填写']
    },
    "borncode": {
        type: String,
        required: [true, '出生地行政区划代码必须填写']
    },
    "nation": {
        type: String,
        required: [true, '民族必须填写']
    },
    "regtype": {
        type: String,
        required: [true, '户口性质必须填写']
    },
    "regcode": {
        type: String,
        required: [true, '户口所在地行政区划必须填写']
    },
    "regaddress": {
        type: String,
        required: [true, '户籍地址必须填写']
    },
    "onlychild": {
        type: String,
        required: [true, '是否独生子女必须填写']
    },
    "origin": {
        type: String,
        required: [true, '籍贯必须填写']
    },
    "homeaddress": {
        type: String,
        required: [true, '居住地址必须填写']
    },
    "zipcode": {
        type: String,
        required: [true, '邮政编码必须填写']
    },
    "preschool": {
        type: String,
        required: [true, '是否受过学前教育必须填写']
    },
    "fname": {
        type: String,
        required: [true, '成员1姓名必须填写']
    },
    "frelationship": {
        type: String,
        required: [true, '成员1关系必须填写']
    },
    "fhomeaddress": {
        type: String,
        required: [true, '成员1现住址必须填写']
    },
    "fregaddress": {
        type: String,
        required: [true, '成员1户口所在地行政区划必须填写']
    },
    "ftel": {
        type: String,
        required: [true, '成员1联系电话必须填写']
    },
    "fguardian": {
        type: String,
        required: [true, '成员1是否监护人必须填写']
    },
    "sname": {
        type: String,
        required: [true, '成员2姓名必须填写']
    },
    "srelationship": {
        type: String,
        required: [true, '成员2关系必须填写']
    },
    "shomeaddress": {
        type: String,
        required: [true, '成员2现住址必须填写']
    },
    "sregcode": {
        type: String,
        required: [true, '成员2户口所在地行政区划必须填写']
    },
    "stel": {
        type: String,
        required: [true, '成员2联系电话必须填写']
    },
    "sguardian": {
        type: String,
        required: [true, '成员2是否监护人必须填写']
    }
},{collection:'StudentEduInfo'});

mongoose.model('StudentEduInfo',StudentEduInfoSchema);