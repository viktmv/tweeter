/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 // Fake data taken from tweets.json
var data = [
 {
   "user": {
     "name": "Newton",
     "avatars": {
       "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
       "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
       "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
     },
     "handle": "@SirIsaac"
   },
   "content": {
     "text": "If I have seen further it is by standing on the shoulders of giants"
   },
   "created_at": 1461116232227
 },
 {
   "user": {
     "name": "Descartes",
     "avatars": {
       "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
       "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
       "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
     },
     "handle": "@rd"
   },
   "content": {
     "text": "Je pense , donc je suis"
   },
   "created_at": 1461113959088
 },
 {
   "user": {
     "name": "Johann von Goethe",
     "avatars": {
       "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
       "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
       "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
     },
     "handle": "@johann49"
   },
   "content": {
     "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
   },
   "created_at": 1461113796368
 }
];


$(function() {
  'use strict'

  function renderTweets(tweets) {
    // loops through tweets
    // TODO: implement this using document fragment
    let tweetContainer = $('.tweets')

    for (let tweet of tweets) {
      // console.log(tweet)
      tweetContainer.append(createTweetElement(tweet))
    }
  }

  function createTweetElement(tweet) {
    let $tweet = $('<article>').addClass('tweet');
    let $header = $('<header>')
    appendTo($header, [
      $('<img>').attr('src', tweet.user.avatars.regular).addClass('avatar'),
      $('<span>').addClass('user-name').text(tweet.user.name),
      $('<span>').addClass('handle').text(tweet.user.handle)
    ])
    let $main = $('<main>').addClass('tweet-text').text(tweet.content.text)
    let $footer = $('<footer>')

    let date = new Date(tweet.created_at)
    let day = daysAgo(tweet.created_at)

    let $tweetAge = $('<div>').addClass('tweet-age').text(day)
    let $interactions = $('<div>').addClass('interactions')

    appendTo($interactions, [
      $('<button>').attr('type', 'button').addClass('flag').text('🇨🇦' ),
      $('<button>').attr('type', 'button').addClass('retweet').text('♻️'),
      $('<button>').attr('type', 'button').addClass('like').text('♥️')
    ])

    appendTo($footer, [$tweetAge, $interactions])
    appendTo($tweet, [$header, $main, $footer])

    return $tweet;
  }

  // Helpers
  function appendTo(el, elems) {
    return elems.forEach(elem => el.append(elem))
  }

  function daysAgo(date) {
    let pastDate = new Date(date)
    let days = Math.round((Date.now() - pastDate)/(1000*60*60*24))

    let stringDate = pastDate.toString().split(" ")
    let day = stringDate[0]
    let month = `${stringDate[1]}  ${stringDate[2]}`
    let year = stringDate[3]

    return days < 30 ? `${days} ago` : `${day} ${month}, ${year}`
  }

  renderTweets(data);
})
