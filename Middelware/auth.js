module.exports = option => {
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')

    const AdminUser = require('../models/AdminUser')

    return //登录校验中间件
    async(req, res, next) => {
        // console.log(req.headers.authorization)
        const token = String(req.headers.authorization || '').split(' ').pop()
            // console.log(token)
            // const tokenData = jwt.verify(token, app.get('secrect'))
            //这里还是用到解构，因为id是一样的
            // console.log(tokenData)
            // assert(token,401,'请提供jwt token')
        assert(token, 401, '请先登录')
        const { id } = jwt.verify(token, req.app.get('secrect'))
        assert(id, 401, '请先登录')
            // assert(id,401,'无效jwt token')
            //     //通过id去找数据库里面的id，增加安全性
            //     //因为这里是中间件 如果后续还想使用，那就的把他挂载req或者res上面
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请先登录')
        console.log(req.user)
        await next()
    }
}