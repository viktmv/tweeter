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

    likeTweet: function (data, callback) {
      db.collection('tweets').updateOne(
        { id: data.id },
        { $push: {liked: data.user } }
      , callback)


      db.collection('users').updateOne(
        { handle: data.user},
        { $push: {liked: data.id} }
      )
    },

    dislikeTweet: function (data, callback) {
      db.collection('tweets').updateOne(
        { id: data.id },
        { $pull: {liked: data.user} }
      , callback)

      db.collection('users').updateOne(
        { handle: data.user},
        { $pull: {likes: data.id} }
      , () => console.log('like removd'))
    },

    saveUser: function(user, callback) {
      db.collection('users').insertOne(user)
      // callback(null, true)
    },

    updateUser: function(user, params, callback) {

    },

    getUser: function(handle, callback) {
       db.collection('users').find({ handle: handle })
       .toArray((err, res) => {
         if (err) return console.error(err)
         callback(null, res[0])
       })
    }
  }
}
