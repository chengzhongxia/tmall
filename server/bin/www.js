#!/usr/bin/env node
const app = require('../app')
const { port } = require('../config')

const http = require('http')
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`server is running at:http://localhost:${port}`)
})
