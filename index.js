const express = require('express')
const io = require('socket.io')
const http = require('http')
const bodyParser = require('body-parser')
const articleParser = require('article-parser')
const uuid = require('uuid/v4')

let dbHandler;
(async () => {
  dbHandler = await require('./database')()
})()

const app = express()
const server = http.createServer(app)
const socket = io(server)

const sessions = {}

const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

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
    if (data.timing && data.timing !== 'none') {
      setTimeout(() => {
        socket.broadcast.emit('delete', data.identifier)
      }, data.timing * 1000)
    }
  })

  socket.on('delete', async data => {
    if (data.messagetype === 'sent') {
      socket.broadcast.emit('delete', data.identifier)
    }
  })

  // Disclaimer: the authentication system is as unsafe as it could be
  socket.on('user', async (data, callback) => {
    switch (data.type) {
      case 'login':
        const loginData = await dbHandler.login(data.username, data.password)
        const loginSessionid = uuid()
        callback({
          userid: loginData.identifier,
          sessionid: loginSessionid
        })
        sessions[loginSessionid] = loginData.identifier
        break
      case 'signup':
        const signupData = await dbHandler.signup(data.username, data.email, data.password)
        const signupSessionid = uuid()
        callback({
          userid: signupData.identifier,
          sessionid: signupSessionid
        })
        sessions[signupSessionid] = signupData.identifier
        break
      case 'token':
        callback({
          authenticated: typeof sessions[data.sessionid] !== 'undefined' && sessions[data.sessionid] === data.userid
        })
        break
      case 'getinfo':
        const userData = await dbHandler.getinfo(data.identifier)
        callback({
          data: userData
        })
    }
  })

  socket.on('messageevent', async data => {
    socket.broadcast.emit('messageevent', data)
  })
  socket.on('conversation', async (data, callback) => {
    switch (data.type) {
      case 'identiferOfCurrentUser':
        callback(sessions[data.sessionid])
      case 'newConversation':
        await dbHandler.newConversation(data.identifiers)
      case 'getIdentifier':
        callback(await dbHandler.getIdentifier(data.usernames))
      case 'getChats':
        callback(await dbHandler.conversationsOfUsers(data.identifiers))
      case 'loadMessages':
        await dbHandler.newMessage(data.chat, data.message)
    }
  })
})

server.listen(port, async () => {
  console.log(`Listening on port ${port}`)
})
