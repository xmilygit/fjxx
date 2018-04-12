var mongoose = require('mongoose');
var StudentInfoSchema = new mongoose.Schema({
    "姓名": {
        type: String,
        required: [true, '姓名必须填写']
    },
    "性别": {
        type: String,
        required: [true, '性别必须填写']
    },
    "出生日期": {
        type: String,
        required: [true, '出生日期必须填写']
    },
    "身份证件号": {
        type: String,
        required: [true, '身份证件号必须填写']
    },
    "出生地行政区划代码": {
        type: String,
        required: [true, '出生地行政区划代码必须填写']
    },
    "民族": {
        type: String,
        required: [true, '民族必须填写']
    },
    "户口性质": {
        type: String,
        required: [true, '户口性质必须填写']
    },
    "户口所在地行政区划": {
        type: String,
        required: [true, '户口所在地行政区划必须填写']
    },
    "现住址": {
        type: String,
        required: [true, '现住址必须填写']
    },
    "是否独生子女": {
        type: String,
        required: [true, '是否独生子女必须填写']
    },
    "籍贯": {
        type: String,
        required: [true, '籍贯必须填写']
    },
    "通信地址": {
        type: String,
        required: [true, '通信地址必须填写']
    },
    "家庭地址": {
        type: String,
        required: [true, '家庭地址必须填写']
    },
    "邮政编码": {
        type: String,
        required: [true, '邮政编码必须填写']
    },
    "是否受过学前教育": {
        type: String,
        required: [true, '是否受过学前教育必须填写']
    },
    "成员1姓名": {
        type: String,
        required: [true, '成员1姓名必须填写']
    },
    "成员1关系": {
        type: String,
        required: [true, '成员1关系必须填写']
    },
    "成员1现住址": {
        type: String,
        required: [true, '成员1现住址必须填写']
    },
    "成员1户口所在地行政区划": {
        type: String,
        required: [true, '成员1户口所在地行政区划必须填写']
    },
    "成员1联系电话": {
        type: String,
        required: [true, '成员1联系电话必须填写']
    },
    "成员1是否监护人": {
        type: String,
        required: [true, '成员1是否监护人必须填写']
    },
    "成员2姓名": {
        type: String,
        required: [true, '成员2姓名必须填写']
    },
    "成员2关系": {
        type: String,
        required: [true, '成员2关系必须填写']
    },
    "成员2现住址": {
        type: String,
        required: [true, '成员2现住址必须填写']
    },
    "成员2户口所在地行政区划": {
        type: String,
        required: [true, '成员2户口所在地行政区划必须填写']
    },
    "成员2联系电话": {
        type: String,
        required: [true, '成员2联系电话必须填写']
    },
    "成员2是否监护人": {
        type: String,
        required: [true, '成员2是否监护人必须填写']
    },
    "学生户籍区域": String,
    "监护人1户籍与学生同户": String,
    "监护人1户籍区域": String,
    "监护人2户籍与学生同户": String,
    "监护人2户籍区域": String,
    "房屋产权归属": String,
    "房屋区域":String
},{collection:'StudentInfo'});

mongoose.model('StudentInfo',StudentInfoSchema);