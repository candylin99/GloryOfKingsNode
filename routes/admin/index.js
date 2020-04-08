//后端的路由
module.exports = app => {
    //引入express
    const express = require('express')

    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')

    const AdminUser = require('../../models/AdminUser')

    //使用express里面的Router（）
    const router = express.Router({
            mergeParams: true //表示合并参数，不然'/admin/api/rest/:resource'这里面的resource在下面的方法里面用不到
        })
        //登录校验中间件
        // const resourceMiddelware = require('../../Middelware/resource')
        // const authMiddelware = require('../../Middelware/auth.js')
    const authMiddelware = async(req, res, next) => {
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
        //1.先连接数据库，serve/index里面负责require它
        //2.定义好数据库的模型，使用它

    //这个模型是自己写的，里面定好所连接的数据库的name啊类型啊
    // const req.Model = require('../../models/req.Model')
    //创建资源
    router.post('/', async(req, res) => {
            // 异步回调函数
            //这边要把数据存进去

            //创建数据
            //数据来源是客户端提交过来的数据，但要想使用要在前面加上wait，必须要在serve/index里面加上中间件
            const model = await req.Model.create(req.body)
                //创建完成后发送给客户端让客户端知道创建完成拉
            res.send(model)
        })
        //编辑的接口，这里是编辑，要把id和新改好的的也传给它
        //更新资源
    router.put('/:id', async(req, res) => {
            const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
            res.send(model)
        })
        //删除某个内容的接口,这个只需要传一个想要删除的id即可
        //删除资源
    router.delete('/:id', async(req, res) => {
            const model = await req.Model.findByIdAndDelete(req.params.id)
                // res.send(model)
            res.send({
                success: true
            })

        })
        //有的页面需要查关联查询，有地方不需要，用条件
        //资源列表接口
    router.get('/', authMiddelware,
            async(req, res) => {
                const queryOptions = {}
                if (req.Model.modelName === 'Category') {
                    queryOptions.populate = 'parent'
                }
                //populate是把在数据库中有关联的数据（关联查询），名字是parent的调出来（暴露出来），是一个对象噢
                // const items = await req.Model.find().populate('parent').limit(10)

                // setOptions???   暂时改成100的限制
                const items = await req.Model.find().setOptions(queryOptions).limit(100)
                res.send(items)
            })
        //获取某一个列表详情页,注意这里获取只需要传id
        // 资源详情
    router.get('/:id', async(req, res) => {
            const model = await req.Model.findById(req.params.id)
            res.send(model)
        })
        // rest/:resource 起一个动态参数资源来匹配这个名字

    //async(req,res,next)是中间件
    app.use('/admin/api/rest/:resource', authMiddelware, async(req, res, next) => {
            //取过来应该是categories inflection.classify会把小写复数转为大写单数
            const modelName = require('inflection').classify(req.params.resource)
                // 给请求对象上面挂载一个属性model，是这个req进来的模型
            req.Model = require(`../../models/${modelName}`)
                //执行了next才会继续往下一个
            next()
        },
        router)

    const multer = require('multer')
        //储存上传的地址 一定要用绝对地址噢 single单个 upload.single('file')中间件
    const upload = multer({ dest: __dirname + '/../../uploads' })
    app.post('/admin/api/upload', upload.single('file'), async(req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)

    })

    //前端把用户名密码传过来 我们在这里进行校验 然后返回前端一串密钥 后续通过密钥证明是哪个用户
    app.post('/admin/api/login', async(req, res) => {
        // res.send('ok')
        //用解构赋值就比较简单 直接取 req.body里面的username和password
        const { username, password } = req.body
            //1.根据用户名找用户
            //先导入用户模型
        const AdminUser = require('../../models/AdminUser')
            //默认不取password 给他一个‘+’号
        const user = await AdminUser.findOne({ username }).select('+password')
            //用assert
        assert(user, 422, '用户不存在')
            // if (!user) {
            //     return res.status(422).send({
            //         message: '用户不存在'
            //     })
            // }
            //2.校验密码
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')
            // if (!isValid) {
            //     return res.status(422).send({
            //         message: '密码错误'
            //     })
            // }
            //3.返回token
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({
            //在加密的 签名里把id包含进去
            id: user._id,
            // _id:user._id,
            // username:user.username,
        }, app.get('secrect'))

        res.send({ token })
    })

    //用函数处理一下异常 错误处理函数
    app.use(async(err, req, res, next) => {
        // console.log(err)
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })

}