$(function () {
  'use strict'

  function renderTweets (tweets) {
    let tweetContainer = $('.tweets')
    let elems = []
    for (let tweet of tweets) {
      elems.unshift(createTweetElement(tweet))
    }
    tweetContainer.append(elems)
  }

  function createTweetElement (tweet) {
    let $tweet = $('<article>').addClass('tweet')
    let $header = $('<header>')
    let {user} = tweet
    appendTo($header, [
      $('<img>').attr('src', user.avatars.regular).addClass('avatar'),
      $('<span>').addClass('user-name').text(user.name),
      $('<span>').addClass('handle').text(user.handle)
    ])

    let $main = $('<main>').addClass('tweet-text').text(tweet.content.text)
    let $footer = $('<footer>')

    let day = daysAgo(tweet.created_at)
    let $tweetAge = $('<div>').addClass('tweet-age').text(day)

    let $interactions = $('<div>').addClass('interactions')

    appendTo($interactions, [
      $('<button>').attr('type', 'button').addClass('flag').text('🇨🇦'),
      $('<button>').attr('type', 'button').addClass('retweet').text('♻️'),
      $('<button>').attr('type', 'button').addClass('like').text('♥️')
    ])

    appendTo($footer, [$tweetAge, $interactions])
    appendTo($tweet, [$header, $main, $footer])

    return $tweet
  }

  // Helpers
  function appendTo (el, elems) {
    return elems.forEach(elem => el.append(elem))
  }

  function daysAgo (date) {
    let pastDate = new Date(date)
    let days = Math.round((Date.now() - pastDate) / (1000 * 60 * 60 * 24))

    let stringDate = pastDate.toString().split(' ')
    let day = stringDate[0]
    let month = `${stringDate[1]}  ${stringDate[2]}`
    let year = stringDate[3]

    return days < 30 ? `${days} days ago` : `${day} ${month}, ${year}`
  }

  // Send tweet and render it on the page
  $('.new-tweet form').on('submit', function (e) {
    e.preventDefault()

    let tweetText = $(this).serialize()
    $.ajax('/tweets/', {
      data: tweetText,
      method: 'POST'
    }).done(() => {
      loadTweets().complete(data => {
        $('.new-tweet textarea').val('').focus()
        let list = data.responseJSON
        $('.tweets').prepend(createTweetElement(list[list.length - 1]))
      })
    })
  })

  // load tweets
  function loadTweets () {
    return $.ajax('/tweets/')
  }

  // Initial render
  loadTweets().complete(data => renderTweets(data.responseJSON))

  // Compose button
  $('.compose').on('click', () => {
    $('.new-tweet').slideToggle(() => $('.new-tweet textarea').focus())
  })

  // Form validation
  $('.new-tweet input').click(e => {
    let $textarea = $('.new-tweet textarea')
    if ($textarea.val().length > 140) {
      e.preventDefault()
      $('.notice').text('Sorry, your tweet is way too long').css('opacity', '1')
    } else if ($textarea.val() == 0) {
      e.preventDefault()
      $('.notice').text('Nothing is not twittable, sorry.').css('opacity', '1')
    }
  })
})
