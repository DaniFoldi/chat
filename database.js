const mongodb = require('mongodb')
const uuid = require('uuid/v4')

const url = process.env.MONGO_URL || 'mongodb://localhost:27017'
const database = process.env.MONGO_DB || 'chat'
module.exports = async () => {
  return new Promise((resolve, reject) => {
    mongodb.MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, (err, client) => {
      const db = client.db(database)
      resolve({
        login: (username, password) => {
          return new Promise((resolve, reject) => {
            db.collection('users').findOne({
              username: username,
              password: password
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(res)
            })
          })
        },
        signup: (username, email, password) => {
          return new Promise((resolve, reject) => {
            db.collection('users').insertOne({
              username: username,
              email: email,
              password: password,
              identifier: uuid()
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(res.ops[0])
            })
          })
        },
        getUsername: identifier => {
          return new Promise((resolve, reject) => {
            db.collection('users').findOne({
              identifier: identifier
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(res.username)
            })
          })
        },
        getIdentifier: username => {
          return new Promise((resolve, reject) => {
            db.collection('users').findOne({
              username: username
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(res.identifier)
            })
          })
        },
        conversationsOfUsers: identifiers => {
          return new Promise((reject, resolve) => {
            db.collection('conversations').find({
              participants: {
                $all: identifiers
              }
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(res)
            })
          })
        },
        newConversation: identifiers => {
          return new Promise((reject, resolve) => {
            const identifier = uuid()
            db.collection('conversations').insertOne({
              messages: [],
              participants: identifiers,
              identifier: identifier
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(identifier)
            })
          })
        },
        newMessage: (conversationIdentifer, message) => {
          return new Promise((reject, resolve) => {
            db.collection('conversations').updateOne({
              identifier: conversationIdentifer
            }, {
              $push: {
                messages: message
              }
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve(res)
            })
          })
        },
        getinfo: identifier => {
          return new Promise((reject, resolve) => {
            db.collection('users').findOne({
              identifier: identifier
            }, (err, res) => {
              if (err)
                return console.log(err) && reject()
              resolve({
                username: res.username
              })
            })
          })
        }
        // deleteMessage: (conversationIdentifer, messageIdentifier) => {
        //   return new Promise((reject, resolve) => {
        //     db.collection('conversations').({
        //       identifier: conversationIdentifer,
        //       'message.identifier'
        //     }, {
        //       $push: {
        //         messages: message
        //       }
        //     }, (err, res) => {
        //       if (err)
        //         return console.log(err) && reject()
        //       resolve(res)
        //     })
        //   })
        // }
      })
    })
  })
}
