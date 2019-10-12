const express = require('express')
const io = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const socket = io(server)

app.use(express.static('public'))

socket.on('connection', socket => {
  socket.broadcast.emit('special', 'A user connected')
  socket.on('disconnect', () => {
    socket.broadcast.emit('special', 'A user disconnected')
  })
  socket.on('message', data => {
    socket.broadcast.emit('message', data)
  })
})

server.listen(3000, () => {
  console.log('Listening on port 3000')
})
