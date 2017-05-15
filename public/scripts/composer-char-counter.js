$(function() {
  'user strict'
  let tweet = $('.new-tweet textarea')
  let counter = $('.new-tweet .counter')
  tweet.on('input', function() {
    let length = 140 - this.value.length
    length < 0
      ? counter.css('color', 'red')
      : counter.css('color', 'initial')
    counter.text(length)
  })
})