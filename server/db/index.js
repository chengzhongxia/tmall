/* 
mongodb
用node.js的events模块的EventEmitter对象，来封装db.js, 用事件派发订阅模式，来解决mongodb的connect连接， once事件触发的 
这个回调问题，可以方便的使用 async/await来解决回调
使代码更优雅
*/
const { MongoClient, ObjectId } = require('mongodb')
const { EventEmitter } = require('events')
const config = require('../config')

class MongodbClient {
  constructor(config){
    this.config = config
    this.emitter = new EventEmitter()
    this.mongoClient = new MongoClient(config.mongoUrl, { useNewUrlParser: true}) // 解决：“不建议使用当前URL字符串解析器”警告

    this.mongoClient.connect(err => {
      if(err) throw err
      // 连接成功
      this.emitter.emit('connect')
    })
  }

  once(event, cb){
    this.emitter.once(event, cb)
  }

  collection(collectionName, dbName = this.config.dbName){
    return this.mongoClient.db(dbName).collection(collectionName)
  }

  // 将_id 字符串 转换为 ObjectId
  ObjectId(_id){
    try{
      return new ObjectId(_id)
    }catch{
      return ''
    }
    
  }
}

module.exports = new MongodbClient(config)