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
  switch (socket.conn.server.clientsCount - 1) {
    case 0:
      socket.emit('special', {
        message: 'No users currently connected'
      })
      break
    case 1:
      socket.emit('special', {
        message: '1 user currently connected'
      })
      break
    default:
      socket.emit('special', {
        message: `${socket.conn.server.clientsCount - 1} users currently connected`
      })
      break
  }

  socket.broadcast.emit('special', {
    message: 'A user connected'
  })
  socket.on('disconnect', async () => {
    socket.broadcast.emit('special', {
      message: 'A user disconnected'
    })
  })
  socket.on('message', async data => {
    socket.broadcast.emit('message', data)
  })
})

server.listen(port, async () => {
  console.log(`Listening on port ${port}`)
})
