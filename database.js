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
              resolve(res)
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
        }
      })
    })
  })
}
