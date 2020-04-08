//后端的路由
module.exports = app => {
    //引入express
    const express = require('express')
        //使用express里面的Router（）
    const router = express.Router()

    //1.先连接数据库，serve/index里面负责require它
    //2.定义好数据库的模型，使用它

    //这个模型是自己写的，里面定好所连接的数据库的name啊类型啊
    const Category = require('../../models/Category')
    router.post('/categories', async(req, res) => {
            // 异步回调函数
            //这边要把数据存进去

            //创建数据
            //数据来源是客户端提交过来的数据，但要想使用要在前面加上wait，必须要在serve/index里面加上中间件
            const model = await Category.create(req.body)
                //创建完成后发送给客户端让客户端知道创建完成拉
            res.send(model)
        })
        //编辑的接口，这里是编辑，要把id和新改好的的也传给它
    router.put('/categories/:id', async(req, res) => {
            const model = await Category.findByIdAndUpdate(req.params.id, req.body)
            res.send(model)
        })
        //删除某个内容的接口,这个只需要传一个想要删除的id即可
    router.delete('/categories/:id', async(req, res) => {
        const model = await Category.findByIdAndDelete(req.params.id)
            // res.send(model)
        res.send({
            success: true
        })

    })

    router.get('/categories', async(req, res) => {
            //populate是把在数据库中有关联的数据（关联查询），名字是parent的调出来（暴露出来），是一个对象噢
            const items = await Category.find().populate('parent').limit(10)
            res.send(items)
        })
        //获取某一个列表详情页,注意这里获取只需要传id
    router.get('/categories/:id', async(req, res) => {
            const model = await Category.findById(req.params.id)
            res.send(model)
        })
        //？？？这个是啥,应该是启用这个路由的意思？？
    app.use('/admin/api', router)
}