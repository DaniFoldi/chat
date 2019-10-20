const mongodb = require('mongodb')

const url = process.env.MONGO_URL || 'mongodb://localhost:27017'
const database = process.env.MONGO_DB || 'chat'

mongodb.MongoClient.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  const db = client.db(database)
  module.exports = {
  }
})
