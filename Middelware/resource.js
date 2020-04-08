module.exports = options => {
    return async(req, res, next) => {

        //取过来应该是categories inflection.classify会把小写复数转为大写单数
        const modelName = require('inflection').classify(req.params.resource)
            // 给请求对象上面挂载一个属性model，是这个req进来的模型
        req.Model = require(`../models/${modelName}`)
            //执行了next才会继续往下一个
        next()
    }
}