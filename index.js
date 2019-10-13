const express = require('express')
const io = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const socket = io(server)

const port = process.env.PORT || 3000

app.use(express.static('public'))

    })
  })(req, res, next)
})

socket.on('connection', async socket => {
  socket.broadcast.emit('special', 'A user connected')
  socket.on('disconnect', async () => {
    socket.broadcast.emit('special', 'A user disconnected')
  })
  socket.on('message', async data => {
    socket.broadcast.emit('message', data)
  })
})

server.listen(port, async () => {
  console.log(`Listening on port ${port}`)
})
