/*
1. 加载 express
2. 创建路由router对象： express.Router()
3. router对象挂载业务路由
4. 导出router，app.js中注册路由：app.use(router)
*/

const express = require('express')


const router = express.Router()

router.get('/', (req,res, next)=>{
  res.render('index', { title: '该express的模板引擎是pug，我是传入的参数', message: '你好，express， 我也是传入参数呀！'})
})

module.exports = router

