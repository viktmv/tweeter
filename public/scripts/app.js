$(function () {
  'use strict'

  // Global user variable for handling session state
  let loggedUser

  // tweet rendering fn
  function renderTweets (tweets, user) {
    let tweetContainer = $('.tweets')
    let elems = []
    let handle = user ? user : ''

    if (!tweets.length)
      return tweetContainer.html(`
        <span class="no-tweets-notice"
          style="text-align: center;
          display: block;
          font-style: italic;">
          So far there\'s no tweets to display
        </span>`
        )
    // tweetContainer.remove('.no-tweets-notice')
    for (let tweet of tweets) {
      tweet.likedBy.find((u) => u == handle)
        ? elems.unshift(createTweetElement(tweet, true))
        : elems.unshift(createTweetElement(tweet, false))
    }
    tweetContainer.append(elems)
  }

  // Creates tweet HTML from given data
  function createTweetElement (tweet, liked) {
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

    let day = timeAgo(tweet.created_at)
    let $tweetAge = $('<div>').addClass('tweet-age').text(day)

    let $interactions = $('<div>').addClass('interactions')

    let likeBtn = $('<button>').attr('type', 'button')
                .addClass('like')
                .attr('data-id', tweet.id)
                .on('click', toggleLike)

    liked ? likeBtn.attr('data-type', 'active').attr('style', 'background-image: url("../images/like-active.svg");')
          : likeBtn.attr('data-type', 'inactive').attr('style', 'background-image: url("../images/like-inactive.svg");')

    $interactions.append(likeBtn)

    $footer.append($tweetAge, $interactions)
    $tweet.append($header, $main, $footer)

    return $tweet
  }

  // Handle the display of time when the tweet was created
  function timeAgo (date) {
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

  // initial button state
  function initBtns() {
    if (!loggedUser) {
      $('.logout-btn').hide()
      $('.compose').hide()

      $('.reg-btn').show()
      $('.login-btn').show()

    }
    else {
      $('.reg-btn').hide()
      $('.login-btn').hide()

      $('.logout-btn').show()
      $('.compose').show()
    }
  }

  // load tweets
  function loadTweets () {
    return $.ajax('/tweets/')
  }

  // Initial render
  loadTweets().complete(data => {
    data = data.responseJSON
    loggedUser = data.user
    loggedUser === null
     ? renderTweets(data.tweets, '')
     : renderTweets(data.tweets, loggedUser)

     initBtns()
  })

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
        let list = data.responseJSON.tweets
        console.log($('.no-tweets-notice'))
        let tweetContainer = $('.tweets')
        $('.no-tweets-notice').remove()
        $('.counter').text('140')
        tweetContainer.prepend(createTweetElement(list[list.length - 1]))
      })
    })
  })

  // Compose button
  $('.compose').on('click', function() {
    if (!loggedUser) return this.disabled = true
    this.disabled = false

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

  // function for like and dislike requests
  function toggleLike(e) {
    if (!loggedUser) return

    let like = $(this)
    let id = like.data('id')

    if (like.data('type') === 'active') {
      like.attr('style', 'background-image: url("../images/like-inactive.svg");')
      like.data('type','inactive')

      $.ajax(`/tweets/${id}/like`, {
        method: 'DELETE',
        data: {
          tweetID: id
        }
      })
    }
    else {
      like.attr('style', 'background-image: url("../images/like-active.svg");')
      like.data('type', 'active')

      $.ajax(`/tweets/${id}/like`, {
        method: 'POST',
        data: {
          tweetID: id
        }
      })
    }
  }

  // user login fn
  function login(data) {
    $.ajax('/login', {
      data: data,
      method: 'POST'
    }).done((user) => {
      loadTweets().complete(data => {
        $('.tweets').text('')
        loggedUser = data.responseJSON.user
        if (user) {
          $('.login-btn').hide()
          $('.login.popup').hide()
          $('.reg-btn').hide()
          $('.logout-btn').show()
          $('.compose').show()
        }
        renderTweets(data.responseJSON.tweets, loggedUser)
      })
    })
  }

  //  Login request
  $('.login.popup form').on('submit', function (e) {
    e.preventDefault()

    $('.compose').prop('disabled', false)
    let data = {
      handle: $('.login-handle').val(),
      pass: $('.login-pass').val()
    }
    login(data)
  })

  // Toggle session forms
  $('.login-btn').click(() => {
    $('.login.popup').slideToggle()
    $('.registration.popup').slideUp()
  })
  $('.reg-btn').click(() => {
    $('.registration.popup').slideToggle()
    $('.login.popup').slideUp()
  })

  // logout
  $('.logout-btn').click(() => {
    $.ajax(`/logout`, {
      method: 'POST'
    }).done(() => {
      loggedUser = null
      window.location.reload()
    })
  })

  // Register request
  $('.register').on('submit', function(e) {
    e.preventDefault()
     let data = {
       name: $('.registration-name').val(),
       handle: $('.registration-handle').val(),
       pass: $('.registration-pass').val()
     }
    $.post(`/register`, data).done(added => {
      login(data)
      if (added) {
        $('.registration.popup').slideUp()
      }
    })
  })
})
