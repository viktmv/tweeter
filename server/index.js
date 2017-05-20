'use strict'

const PORT = 8080
const morgan = require('morgan')
const bcrypt = require('bcrypt')
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const {MongoClient} = require('mongodb')
const MONGODB_URI = 'mongodb://localhost:27017/tweets'

// basic app set-up
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(morgan('dev'))
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// Mongo
MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) return console.error(`Failed to connect: ${MONGODB_URI}`)

  console.log(`Connected to mongodb: ${MONGODB_URI}`)

  // init routes
  const DataHelpers = require('./lib/data-helpers.js')(db)
  const tweetsRoutes = require('./routes/tweets')(DataHelpers)
  const sessionRoutes = require('./routes/session')(DataHelpers)

  app.use('/', sessionRoutes)
  app.use('/tweets', tweetsRoutes)
})

app.listen(PORT, () => {
  console.log('Example app listening on port ' + PORT)
})
