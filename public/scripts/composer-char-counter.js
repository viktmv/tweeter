$(function() {
  'user strict'
  let tweet = $('.new-tweet textarea')
  let counter = $('.new-tweet .counter')
  tweet.on('input', function() {
    $('.notice').css('opacity', '0') // clear the notice text

    let length = 140 - this.value.length
    length < 0
      ? counter.css('color', 'red')
      : counter.css('color', 'initial')
    counter.text(length)
  })
})
