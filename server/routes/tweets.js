'use strict'

const express = require('express')
const tweetsRoutes = express.Router()

module.exports = function (DataHelpers) {

  // Handle like request
  tweetsRoutes.post('/:id/like', function (req, res) {
    if (!req.session.userID) {
      console.warn('No user found')
      return res.sendStatus(403)
    }

    DataHelpers.likeTweet({ id: req.body.tweetID, user: req.session.userID },
      err => {
        if (err) return res.sendStatus(500)
        res.sendStatus(201)
      })
  })

  // Handle dislike request
  tweetsRoutes.delete('/:id/like', function (req, res) {
    if (!req.session.userID) {
      console.warn('No registered user')
      return res.sendStatus(403)
    }
    DataHelpers.dislikeTweet({ id: req.body.tweetID, user: req.session.userID },
      err => {
        if (err) return res.sendStatus(500)
        res.sendStatus(201)
      })
  })

  // Get index page
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

  // create new tweet
  tweetsRoutes.post('/', function (req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' })
      return
    }

    if (!req.session.userID) res.status(403).send('Forbidden')

    const generateRandomString = () => Math.random().toString(36).substring(2, 8)
    const handle = req.session.userID

      //Get user and create a new tweet with user info
    DataHelpers.getUser(handle, (err, user) => {
      if (err) return console.error(err)
      const tweet = {
        id: generateRandomString(),
        user: user,
        content: {
          text: req.body.text
        },
        created_at: Date.now(),
        likedBy: []
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
