const mongoClient = require('../db')

/* 
插入初始化数据，实际项目中用不到，测试使用
*/
// mongoClient.once('connect', async () => {
//   const collection = mongoClient.collection('goods')

//   try {
//     // 删除已存在
//     await collection.deleteMany()
//     // 插入测试数据
//     await collection.insertMany([
//       { goodName: '华为荣耀P30', count: '99' },
//       { goodName: '华为荣耀Mate10', count: '1000' },
//       { goodName: '小米青春9', count: '179' },
//       { goodName: 'iPhone', count: '999' },
//       { goodName: 'iMac', count: '1000' },
//       { goodName: 'macbook', count: '899' },
//     ])
//   } catch {
//     console.log('插入数据失败')
//   }
// })

const controller = {
  /* 列表查询： id, goodName, count*/
  list: async function (req, res, next) {
    const collection = mongoClient.collection('goods')
    const { _id, goodName, count, des } = req.query
    const condition = {}
    _id ? (condition._id = mongoClient.ObjectId(_id)) : ''
    goodName ? (condition.goodName = { $regex: new RegExp(goodName) }) : ''
    count ? (condition.count = { $regex: new RegExp(count) }) : ''
    des ? (condition.des = { $regex: new RegExp(des) }) : ''
    // 通过ObjectId可以获取创建时间
    // const t = mongoClient.ObjectId('616e5f8a5b1ae0982d4e8143').getTimestamp() // 2021-10-19T06:02:50.000Z
    // console.log(new Date(t).toLocaleDateString()); // 2021/10/19

    // const total = await collection.countDocuments()
    const total = await collection.find(condition).count()
    const data = await collection.find(condition).toArray()

    res.json({ status: 200, code: '000000', data: { list: data, total } })
  },
  async add(req, res, next) {
    const { count, goodName, des } = req.body
    if (!goodName) res.json({ status: 200, code: '123456', message: '商品名是必输项！' })

    const collection = mongoClient.collection('goods')
    const one = await collection.findOne({ goodName })
    if (one?.goodName === goodName) {
      res.json({ status: 200, code: '123456', message: '该商品已存在！' })
      return
    }

    const info = { goodName, count: count || 1, des }

    try {
      await collection.insertOne(info)
      res.json({ status: 200, code: '000000', message: 'ok' })
    } catch (e) {
      throw e
    }
  },
  async delete(req, res, next) {
    const { _id } = req.query
    console.log('query', req.query);
    console.log('params', req.params);
    console.log( req.body);
    console.log( req);
    if (!_id) {
      res.json({ status: 200, code: '123456', message: '_id是必输项' })
      return true
    }

    const collection = mongoClient.collection('goods')
    await collection.deleteOne({ _id: mongoClient.ObjectId(_id) })
    res.json({ status: 200, code: '000000', message: '删除成功' })
  },
  async edit(req, res, next) {
    const { _id, count, goodName, des } = req.body
    if (!_id) {
      res.json({ status: 200, code: '123456', message: '_id是必输项' })
      return
    } else {
      const collection = mongoClient.collection('goods')
      const one = await collection.find({ goodName }).toArray()
      if (one.length === 0) {
        res.json({ status: 200, code: '123456', message: '商品名必输！' })
        return
      }
      if (one.length > 1 || one[0]._id.toString() !== _id) {
        res.json({ status: 200, code: '123456', message: '该商品名已存在，换一个名字！' })
        return
      }

      await collection.updateOne({ _id: mongoClient.ObjectId(_id) }, { $set: { count: count, goodName, des: des } }, { upsert: true })
      res.json({ status: 200, code: '000000', message: '更新成功' })
    }
  },
  async detail(req, res, next) {
    const _id = req.qeury._id
    if (!_id) {
      res.json({ status: 200, message: '_id是必输项' })
      return
    }
    const collection = mongoClient.collection('goods')
    const data = await collection.findOne({ _id: mongoClient.ObjectId(_id) })

    res.json({ status: 200, code: '000000', data: { list: data } })
  },
}

module.exports = controller
