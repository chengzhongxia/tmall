/* 
1. 加载 express
2. 创建user路由对象 express.Router()
3. 挂载user路由
4. 导出user路由，app.js中注册：app.use('/user', userRouter)
*/

const express = require('express')
const jwt = require('jsonwebtoken')

const key = 'jwtSecret'

const router = express.Router()

router.post('/login', async (req, res, next) => {
  const { userName, password } = req.body.data
  // let token = req.headers.cookie
  /* 登录校验 */
  if (userName === 'czx' && password === '123') {
    // if (token) {
    //   const tokenVerify = await jwt.verify(token, key)
    //   if (!tokenVerify) {
    //     token = jwt.sign({ data: { userName, password } }, key)
    //   } else if (tokenVerify.data.userName !== userName || tokenVerify.data.password !== password) {
    //     token = jwt.sign({ data: { userName, password } }, key)
    //   }
    // }else {
    //   token = jwt.sign({ data: { userName, password } }, key)
    // }

    res.json({
      status: 200,
      message: '登录成功',
      code: '000000',
      // data: { token: 'Bearer ' + token },
      data: { token: 'Bearer ' + jwt.sign({ data: { userName, password } }, key) },
    })
  } else {
    res.json({ status: 200, message: '用户名或密码错误', code: '123456' })
  }
})

module.exports = router
