const express = require("express")

const app = express()
    //为了简单的教学 在这里随便设定一个secrect 全局设定
app.set('secrect', 'adsadfdafdsgfadds')

// 跨域的模块
app.use(require('cors')())
    //加上中间件
app.use(express.json())
    // 分类路由不建议写在这里，因为可能会有很多个路由
    //分开写，routes里面admin文件夹的 index.js
    //这个是后端的路由

//指定静态文件的地址
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./routes/admin')(app)

require('./routes/web')(app)

//这是数据库的路由
//plugins/db.js
require('./plugins/db')(app)


//监听3000端口
app.listen(3000, () => {
    console.log('http://localhost:3000');
});