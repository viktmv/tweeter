'use strict'

const {MongoClient} = require('mongodb')
const MONGODB_URI = 'mongodb://localhost:27017/tweets'

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) return console.error(`Failed to connect: ${MONGODB_URI}`)

  console.log(`Connected to mongodb: ${MONGODB_URI}`)

  function getTweets (callback) {
    db.collection('tweets').find().toArray(callback)
  }

  getTweets((err, tweets) => {
    if (err) return console.error(err)
    tweets.forEach(console.log)
  })
  db.close()
})
