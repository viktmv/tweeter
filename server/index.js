'use strict'

const PORT = 8080
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const cookieSession = require('cookie-session')

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

const {MongoClient} = require('mongodb')
const MONGODB_URI = 'mongodb://localhost:27017/tweets'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) return console.error(`Failed to connect: ${MONGODB_URI}`)

  console.log(`Connected to mongodb: ${MONGODB_URI}`)

  const DataHelpers = require('./lib/data-helpers.js')(db)
  const tweetsRoutes = require('./routes/tweets')(DataHelpers)

  app.use('/tweets', tweetsRoutes)
})

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT)
})
