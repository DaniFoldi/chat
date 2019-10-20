const express = require('express')
const io = require('socket.io')
const http = require('http')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const articleParser = require('article-parser')
const cookieParser = require('cookie-parser')

const app = express()
const server = http.createServer(app)
const socket = io(server)

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use(session({
  secret: 'session secret',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))


app.get('/api/tools/article-parser', (req, res, next) => {
  articleParser.extract(req.query.url).then(article => {
    res.send(article)
  })
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
    if (data.timing !== 'none') {
      setTimeout(() => {
        socket.broadcast.emit('delete', data.identifier)
      }, data.timing * 1000)
    }
  })
})

server.listen(port, async () => {
  console.log(`Listening on port ${port}`)
})
