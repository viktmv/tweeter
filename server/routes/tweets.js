'use strict'

const express = require('express')
const tweetsRoutes = express.Router()
const userHelper = require('../lib/util/user-helper')


module.exports = function (DataHelpers) {

  tweetsRoutes.post('/:id/like', function (req, res) {
    if (!req.body.user)  {
      console.log('no user')
      return res.sendStatus(403)
    }

    DataHelpers.likeTweet({ id: req.body.tweetID, user: req.session.userID },
      () => console.log('Counter incremented'))
    res.sendStatus(201)
  })

  tweetsRoutes.delete('/:id/like', function (req, res) {
    if (!req.body.user)  {
      console.log('no user')
      return res.sendStatus(403)
    }
    DataHelpers.dislikeTweet({ id: req.body.tweetID, user: req.session.userID },
      () => console.log('Counter decremented'))
    res.sendStatus(201)
  })

  tweetsRoutes.get('/', function (req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        if (req.session.userID) {
            res.send({tweets, user: req.session.userID})
        }
        else res.send({tweets: tweets, user: null})
      }
    })
  })

  tweetsRoutes.post('/login', (req, res) => {
    console.log('request arrived')
    DataHelpers.getUser(req.body.handle, (err, user) => {
      if (!user) return res.status(403).send('No user found')

      if (!(user.password == req.body.pass)) return res.status(403)

      console.log('cookies set')
      req.session.userID = req.body.handle
      res.status(200).send(req.session.userID)
    })
  })

  tweetsRoutes.post('/register', (req, res) => {
    let user = {
      name: req.body.name,
      handle: req.body.handle,
      password: req.body.pass,
      avatars: {},
      likes: []
    }
    console.log(req.body.handle + 'added to DB')
     DataHelpers.saveUser(user, () => console.log('Addition successfull'))
     res.sendStatus(200)
  })

  tweetsRoutes.post('/logout', (req, res) => {
    req.session = null
    res.clearCookie('userID')
    res.status(301).redirect('http://localhost:8080/')
  })

  tweetsRoutes.post('/', function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' })
      return
    }

    const generateRandomString = () => Math.random().toString(36).substring(2, 8)

    const handle = req.session.userID ? req.session.userID : userHelper.generateRandomUser()

    DataHelpers.getUser(handle, (err, user) => {
      if (err) return console.error(err)
      const tweet = {
        id: generateRandomString(),
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        counter: 0,
        liked: []
      }
      DataHelpers.saveTweet(tweet, (err) => {
        if (err) {
          res.status(500).json({ error: err.message })
        } else {
          res.status(201).send()
        }
      })
    })
  })

  return tweetsRoutes
}
