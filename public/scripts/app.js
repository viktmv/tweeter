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
    $header.append(
      $('<img>').attr('src', user.avatars.regular).addClass('avatar'),
      $('<span>').addClass('user-name').text(user.name),
      $('<span>').addClass('handle').text(user.handle)
    )

    let $main = $('<main>').addClass('tweet-text').text(tweet.content.text)
    let $footer = $('<footer>')

    let day = daysAgo(tweet.created_at)
    let $tweetAge = $('<div>').addClass('tweet-age').text(day)

    let $interactions = $('<div>').addClass('interactions')

    $interactions.append(
      $('<button>').attr('type', 'button').addClass('flag').text('🇨🇦'),
      $('<button>').attr('type', 'button').addClass('retweet').text('♻️'),
      $('<button>').attr('type', 'button').addClass('like').text('♥️')
    )

    $footer.append($tweetAge, $interactions)
    $tweet.append($header, $main, $footer)

    return $tweet
  }

  // Handle the display of when the tweet was created
  function daysAgo (date) {
    let pastDate = new Date(date)
    let now = Date.now()

    let days = Math.round((now - pastDate) / (1000 * 60 * 60 * 24))
      , minutesNow = Math.round(now / (1000 * 60))
      , minutesPast = Math.round(pastDate / (1000 * 60))
      , hoursNow = Math.round(now / (1000 * 60 * 60))
      , hoursPast = Math.round(pastDate / (1000 * 60 * 60))

    let stringDate = pastDate.toString().split(' ')
      , day = stringDate[0]
      , month = `${stringDate[1]}  ${stringDate[2]}`
      , year = stringDate[3]

    let time
      , minDiff = minutesNow - minutesPast
      , hourDiff = hoursNow - hoursPast

    if (minDiff < 60) {
      time = minDiff <= 1 ? `just now` : `${minDiff} minutes ago`
    }
    else if (hourDiff < 60) {
      time = hourDiff === 1 ? `${hourDiff } hour ago` : `${hourDiff } hours ago`
    }
    else if (days < 30) {
      time = days === 1 ? `${days} day ago` : `${days} days ago`
    }
    else time = `${day} ${month}, ${year}`

    return time
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
