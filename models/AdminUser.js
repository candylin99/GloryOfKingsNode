//这个模型存放Category的数据
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    //定义模型的字段
    username: { type: String },
    password: {
        type: String,
        //不可查询，这样就不会出现再保存的时候 把散列后的密码又散列
        select: false,
        //密码谁都不许看，npm i bcrypt
        set(val) {
            //散列是个同步方法，它返回值默认是异步方法
            //加密指数10-12
            return require('bcrypt').hashSync(val, 10)
        }

    },

})

module.exports = mongoose.model('AdminUser', schema)