//这个模型存放Category的数据
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //定义模型的字段
    name: { type: String },

    //再模型里增加一个parent，类型为数据库里面的id（ObjectId）,ref表示它关联的是哪个模型
    //需要调出来的时候就可以快速的找到其上级目录（与其他数据的关联）
    parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
})

schema.virtual('children', {
    localField: '_id',
    foreignField: 'parent', //关联的
    justOne: false,
    ref: 'Category'
})

schema.virtual('newsList', {
    localField: '_id',
    foreignField: 'categories',
    justOne: false,
    ref: 'Article'
})


//导出，第一个参数是数据库的名字，第二个是数据库的内容，这里只有一个name
module.exports = mongoose.model('Category', schema)
    //导出的是一个mogoose模型，哪里需要它就用它，这里是routes/admin里用