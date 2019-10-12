const express = require('express')
const io = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const socket = io(server)

app.use(express.static('public'))

socket.on('connection', socket => {
  console.log('connected')
  socket.on('disconnect', () => {
    console.log('disconnected')
  })
})

server.listen(3000, () => {
  console.log('Listening on port 3000')
})
