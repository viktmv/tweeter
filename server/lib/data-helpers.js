'use strict'

// Simulates the kind of delay we see with network or filesystem operations
// const simulateDelay = require("./util/simulate-delay")

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers (db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function (newTweet, callback) {
      try {
        db.collection('tweets').insertOne(newTweet)
        callback(null, true)
      } catch (e) {
        return console.error(e)
      }
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function (callback) {
      db.collection('tweets').find()
      .toArray((err, res) => {
        if (err) return console.error(err)

        const sortNewestFirst = (a, b) => a.created_at - b.created_at
        callback(null, res.sort(sortNewestFirst))
      })
    },

    likeTweet: function (tweetID, callback) {
      db.collection('tweets').updateOne(
        { id: tweetID },
        { $inc: {counter: 1 } }
      , callback)
    },

    dislikeTweet: function (tweetID, callback) {
      db.collection('tweets').updateOne(
        { id: tweetID },
        { $inc: {counter: -1 } }
      , callback)
    },
    
    saveUser: function(user, callback) {
      db.collection('users').insertOne(user)
    },

    updateUser: function(user, params, callback) {

    }
  }
}
