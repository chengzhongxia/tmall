const ws = require('nodejs-websocket')

const server = ws.createServer(connection => {
  connection.on('connect', code => {
    console.log('开启连接：', code)
  })

  connection.on('close', code => {
    console.log('关闭连接：', code)
  })

  connection.on('error', code => {
    try {
      connection.close()
    } catch (e) {
      console.log('close 异常', e)
    }
    console.log('连接异常，关闭', code)
  })

  connection.on('text', result => {
    console.log('发送消息', result)
    connection.sendText(result)
  })
})

server.on('close', () => {
  console.log('连接释放')
})

server.listen(3002)


// const WebSocketServer = require('ws').Server
// const socket = new WebSocketServer({port: 3002})
// socket.on('connection',  ws => {
//   ws.on('message', message => {
//     console.log(message);
//   })
// })