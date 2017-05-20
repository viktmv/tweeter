'use strict'

// Defines helper functions for saving,
// getting tweets, and other interactions with DB
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

    // Handle like and update DB
    likeTweet: function (data, callback) {
      db.collection('tweets').updateOne(
        { id: data.id },
        { $push: {likedBy: data.user } }
      , callback)

      db.collection('users').updateOne(
        { handle: data.user},
        { $push: {likes: data.id} }
      )
    },

    // Handle dislike and update DB
    dislikeTweet: function (data, callback) {
      db.collection('tweets').updateOne(
        { id: data.id },
        { $pull: {likedBy: data.user} }
      , callback)

      db.collection('users').updateOne(
        { handle: data.user},
        { $pull: {likes: data.id} }
      )
    },

    // Save user to DB
    saveUser: function(user, callback) {
      db.collection('users').insertOne(user)
      callback(null, true)
    },

    // Retrieve user from DB
    getUser: function(handle, callback) {
      db.collection('users').find({ handle: handle })
       .toArray((err, res) => {
         if (err) return console.error(err)
         callback(null, res[0])
       })
    }
  }
}
