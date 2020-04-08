//这个模型存放Category的数据
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //定义模型的字段
    title: { type: String },
    description: { type: String },
    categories: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }
    ],

}, {
    //设置带有时间
    timestamps: true
})

module.exports = mongoose.model('Article', schema)