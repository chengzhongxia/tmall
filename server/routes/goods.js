/* 
1. 加载 express
2. 创建goods路由对象 express.Router()
3. 挂载goods路由
4. 导出goods路由，app.js中注册：app.use('/goods', goodsRouter)
*/

const express = require('express')
const controller = require('../controller')

const router = express.Router()

/* 
GET、POST、PUT、DELETE4个表示操作方式的动词对服务端资源进行操作：
GET用来获取资源，POST用来新建资源（也可以用于更新资源），PUT用来更新资源，DELETE用来删除资源；
*/

router.get('/list', controller.list)
router.post('/add', controller.add)
router.delete('/delete', controller.delete)
router.put('/edit', controller.edit)
router.get('/detail', controller.detail)

module.exports = router