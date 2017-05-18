'use strict'

const express = require('express')
const tweetsRoutes = express.Router()
const userHelper = require('../lib/util/user-helper')

module.exports = function (DataHelpers) {

  tweetsRoutes.post('/:id/like', function (req, res) {
    console.log(req.body.tweetID)
    console.log(req.session)
    DataHelpers.likeTweet({ id: req.body.tweetID, user: req.session.userID },
      () => console.log('Counter incremented'))
  })

  tweetsRoutes.delete('/:id/like', function (req, res) {
    DataHelpers.dislikeTweet({ id: req.body.tweetID, user: req.session.userID },
      () => console.log('Counter decremented'))
  })

  tweetsRoutes.get('/', function (req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.json(tweets)
      }
    })
  })

  tweetsRoutes.post('/login', (req, res) => {
    DataHelpers.getUser(req.body.handle, (err, user) => {
      if (!user) return res.status(403).send('No user found')

      req.session.userID = req.body.handle
      res.status(200).send(user)
    })
  })

  tweetsRoutes.post('/', function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' })
      return
    }

    const generateRandomString = () => Math.random().toString(36).substring(2, 8)

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser()

    DataHelpers.saveUser(user)

    const tweet = {
      id: generateRandomString(),
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      counter: 0
    }

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.status(201).send()
      }
    })


  })

  return tweetsRoutes
}
