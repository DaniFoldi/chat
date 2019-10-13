const express = require('express')
const io = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const socket = io(server)

const port = process.env.PORT || 3000
const prefix = process.env.PREFIX || '/'

app.use(prefix, express.static('public'))

socket.on('connection', socket => {
  socket.broadcast.emit('special', 'A user connected')
  socket.on('disconnect', () => {
    socket.broadcast.emit('special', 'A user disconnected')
  })
  socket.on('message', data => {
    socket.broadcast.emit('message', data)
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
