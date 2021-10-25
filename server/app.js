const express = require('express')
const { resolve } = require('path')
const favicon = require('serve-favicon') // 处理favicon
const cookieParser = require('cookie-parser')

const expressJwt = require('express-jwt')

const indexRouter = require('./routes')
const userRouter = require('./routes/user')
const goodsRouter = require('./routes/goods')

const app = express()
/* 
配置模板引擎
1. 设置模板文件路径
2. 创建一个模板引擎， 使用'pug'为后缀
3. 设置所使用的模板引擎

app.set('views', resolve(__dirname, 'views'))
app.engine('html',require('ejs').renderFile)
app.set('view engine', 'html')
*/

app.set('views', resolve(__dirname, 'views'))
app.set('view engine', 'pug')

/* 处理favicon请求 */
app.use(favicon(resolve(__dirname, 'public', 'favicon.ico')))

/* body-parser插件已被弃用，express已内置 */
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
/* 通过req.body.id 这种格式来读取参数： 使用express内置json、urlencoded中间件 */
app.use(express.json())
/* 
extended:false 表示使用系统模块querystring来处理，官方推荐
extended:true 表示使用第三方模块qs来处理 。 从功能性来讲，qs比querystring要更强大，所以这里可以根据项目的实际需求来考虑
*/
app.use(express.urlencoded({ extended: false })) // extended:false  表示使用系统模块querystring来处理，官方推荐

/* 注册cookie-parser */
app.use(cookieParser())

/* 
注册路由
*/

app.use(expressJwt({ secret: 'jwtSecret', algorithms: ['HS256'] }).unless({ path: ['/','/user/login', '/goods/list'] }))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/goods', goodsRouter)

// module.exports = app

app.listen(3001, () => {
  console.log('server is running at:http://localhost:3001')
})
