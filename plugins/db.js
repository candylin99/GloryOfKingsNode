module.exports = app => {
    //写法：exports导出是一个函数，接受参数app，目前用不到，可能以后会用上
    const mongoose = require('mongoose')
        //连接数据库node-vue-moba
    mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba', {
            useNewUrlParser: true
                //作用是避免“不建议使用当前URL字符串解析器”警告
        })
        //这个require-all是一个插件这样就module文件夹下的所有js的内容全部引用了一遍
        //只把他引用了一遍
    require('require-all')(__dirname + '/../models')
}