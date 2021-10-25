1. cookie
   cookie 存储在

- 请求的请求头的 cookie 字段中
- 请求的响应头的 Set-Cookie 字段中
  每个 Http 请求和响应都会带有相应的头部信息。
  默认情况下，发送 XHR 请求时，还会带有以下头部信息
- Accept:浏览器能够处理的内容类型
- Accept-Charset:浏览器能够显示的字符集
- Accept-Encoding：浏览器能够处理的压缩编码
- Accept-Language：浏览器当前设置的语言
- Connection：浏览器与服务器之间连接的类型
- Cookie：当前页面设置的任何 Cookie
- Host：发出请求的页面所在的域
- Referer：发出请求的页面的 URL
- User-Agent：浏览器的用户代理字符串
  等

HTTP 响应头部信息：

- Date：表示消息发送的时间，时间的描述格式由 rfc822 定义
- server:服务器名字。
- Connection：浏览器与服务器之间连接的类型
- content-type:表示后面的文档属于什么 MIME 类型
- Cache-Control：控制 HTTP 缓存
  等

2. node.js 的 event 模块
   node.js 的 event 模块只提供了一个对象： event.EventEmitter
   EventEmitter 的核心： 事件触发和事件监听器功能的封装

node.js 中的 I/O 操作在完成时都会发送一个事件到事件队列中。
node.js 中许多对象都会分发事件： 一个 net.Server 对象每次在有新连接时会发送一个事件；一个 fs.readStream 对象会在文件被打开时触发一个事件。
所有这些产生事件的对象都是 event.EventEmitter 的实例

```javascript
const EventEmitter = require('event').EventEmitter
const event = new EventEmitter()

event.on('some event', arg1 => {
  console.log(arg1)
  console.log('some event 触发')
})

setTimeout(() => {
  event.emit('some event', '参数1')
})
```

- node.js 的 EventEmitter 的简单应用
  使用 EventEmitter，事件派发订阅模式，来解决 mongodb 的回调问题

```javascript
const { EventEmitter } = require('events')
const { MongoClient } = require('mongodb')
const config = require(../config)

class MongodbClient {
  constructor(config){
    this.config = config
    this.emitter = new EventEmitter()
    this.mongoClient = new MongoClient(config.url, {useNewUrlParser: trur}) // 解决：“不建议使用当前URL字符串解析器”警告

    this.mongoClient.connect(err => {
      if(err) throw err
      // 连接成功
      this.emitter.emit('connect')
    })
  }
  once(event, cb){
    this.emitter.once(event, cb)
  }

  collection(colName, dbName = this.config.dbName){
    return this.mongoClient.db(dbName).collection(colName)
  }
}

module.exports = new MongodbClient(config)
```

在 node.js 中使用

```javascript
const { resolve } = require('path')
const app = require('express')()
const mongoClient = require('../db')

app.get('/list', async (req, res) => {
  const { page, keyword, page } = req.query
  const condition = {}

  keyword ? (condition.name = { $regex: new RegExp(keyword) }) : ''

  const collection = mongoClient.collection('friuts')
  const total = await collection.countDocuments()
  const data = await collection
    .find(condition)
    .skip((page - 1) * 5)
    .limit(5)
    .toArray()

  res.json({ status: 200, data: { list: data, pagination: { total, page } } })
})
```

3. node.js 中使用 mongodb

- npm i mongodb
- 本地启动 mongodb 客户端命令：1. `mongod` 2. `mongo`
- mongodb 操作数据库

  > `show dbs`  
  > `use tMall` > `show collections` => goods user
  > `db.goods.find()` => 查询集合中所有数据， db.集合名.find()
  > 新建集合
  > `use tMall` > `db.createCollection('user')`
  > 删除集合
  > `use tMall` > `db.user.drop()`
  > 删除文档
  > `use tMall` > `db.dropDatabase()`

- 代码中使用
- 使用 node.js 的 events 的 EventEmitter 事件派发订阅模式 来封装 db， 解决回调问题
- 对 mongodb 进行增删改查操作
  mongodb 操作的封装, MongoClient.js

```javascript
const { EventEmitter } = require('events')
const { MongoClient, ObjectId } = require('mongodb')
/* {
  port: 3001,
  mongoUrl: 'mongodb://127.0.0.1:27017/tMall',
  dbName: 'tMall'
} */
const config =  require(''../config)

class MongodbClient {
  constructor(config){
    this.config = config
    this.emitter = new EventEmitter()
    this.mongoClient = new MongoClient(config.mongoUrl, { useNewUrlParser: true }) // 解决：“不建议使用当前URL字符串解析器”警告

    this.mongoClient.connect(err => {
      if(err) throw err
      /* 连接成功 */
      this.emitter.emit('connect')
    })
  }

  once(event, cb){
    this.emitter.once(event, cb)
  }

  on(event, cb){
    this.emitter.on(event, cb)
  }

  collection(collectionName, dbName = this.config.dbName){
    return this.mongoClient.db(dbName).collection(collectionName)
  }

  /* 将_id 字符串 转换为 ObjectId */
  ObjectId(_id){
    return new ObjectId(_id)
  }

}

module.exports = new MongodbClient(config)

```

mongodb 进行增删改查

```javascript
const mongoClient = require('../MongoClient')
const { Router } = require('express')

const router = Router()

router.get('/', (req, res, next) => {
  const collection = mongoClient.collection('goods')

  const { _id, goodName, count } = req.body
  const condition = {}
  _id ? (condition._id = mongoClient.ObjectId(_id)) : ''
  goodName ? (condition.goodName = { $regex: new RegExp(goodName) }) : ''
  count ? (condition.count = { $regex: new RegExp(count) }) : ''

  // 通过ObjectId可以获取创建时间
  // const t = mongoClient.ObjectId('616e5f8a5b1ae0982d4e8143').getTimestamp() // 2021-10-19T06:02:50.000Z
  // console.log(new Date(t).toLocaleDateString()); // 2021/10/19

  // const total = await collection.countDocuments()
  const total = await collection.find(condition).count()
  const data = await collection.find(condition).toArray()

  res.json({ status: 200, data: { list: data, total } })
})

module.exports = router
```

4. node.js 中使用 token
   **express 中需要使用要 jsonwebtoken、exprss-jwt 两个依赖包**
   1. 登录接口，jsonwebtoken.sign()生成token，发送到前端
   2. 前端拿到token， 存储到 loacalstorage、请求头的cookie中， 请求头的authorization字段中
      authorization请求头中，token需要拼接'Bearer ' ,有空格， 'Bearer '+token
      authorization字段是为了 后台express-jwt校验需要用到，  'Bearer '也是express-jwt需要的格式
   3. 后台使用express()使用中间件 express-jwt来进行校验

   - jsonwebtoken 提供 2 个方法， sign、verify：sign 生成 token、verify 验证 token
   - express-jwt 是一个中间件，主要是用来校验 token 的

- jsonwebtoken

1. jsonwebtoken.sign

```javascript
  var token = jwt.sign({ foo: 'bar' }, 'shhhhhh');
   jwt.sign(payload, secretOrPrivateKey, options, callback)
   options: {
   algorithm: 'RS256', // HS256
   expiresIn: 60 _ 60 _ 24 // 过期时间
   ...
   }
```

2. jsonwebtoken.verity

```javascript
jwt.verity(token, secret, callback(data))
// tokenVerify: 就是 sign 方法中传入的 payload
const tokenVerify = await jwt.verify(token, key)
```

3. 实际应用

```javascript
const router = require('express').Router()
const jwt = require('jsonwebtoken')

const secret = 'jwtSecret' // 秘钥应该是存储在数据库中不可示人

router.post('/login', (req, res, next) => {
  const { userName, password } = req.body

  // todo
  if (true) {
    const token = jwt.sign({ data: { userName, password } }, secret, { expiresIn: 60 * 60 })
  }
})
```

- express-jwt

```javascript
const express = require('express')

const expressJwt = require('express-jwt')

const indexRouter = require('./routes')
const userRouter = require('./routes/user')
const goodsRouter = require('./routes/goods')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// algorithms: 必输字段
// unless： 不需要做校验的路由
app.use(expressJwt({ secret: 'jwtSecret', algorithms: ['HS256'] }).unless({ path: ['/login'] }))

app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/goods', goodsRouter)

// module.exports = app

app.listen(3001, () => {
  console.log('server is running at:http://localhost:3001')
})
```
