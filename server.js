const express = require('express')
const fs = require('fs')
const request = require('request')

var app = express()
const facebook_access_token = encodeURIComponent(fs.readFileSync('facebook_access_token', 'utf8').trim())


function get_events(callback) {
  request(
    `https://graph.facebook.com/v2.6/dxephilly?fields=events&access_token=${facebook_access_token}`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(JSON.parse(body).events.data)
      } else {
        console.log(error)
      }
    })
}

function get_upcoming_events(callback) {
  function event_is_upcoming(event) {
    var now = new Date()
    var eventdate = new Date(event.start_time)
    if (eventdate.valueOf() > now.valueOf()) {
      return true
    } else {
      return false
    }
  }
  get_events(function(events) {
    upcoming_events = events.filter(event_is_upcoming)
    callback(upcoming_events)
  })
}

// Get all events
app.get('/facebook/events', function(req, res) {
  get_events(function(events) {
    res.json(events)
  })
})

// Get all upcoming events
app.get('/facebook/events/upcoming', function(req, res) {
  get_upcoming_events(function(events) {
    res.json(events)
  })
})

// Get only the next upcoming event
app.get('/facebook/events/upcoming/next', function(req, res) {
  get_upcoming_events(function(events) {
    var next_event
    for (var i = 0; i < events.length; i++) {
      if (!next_event) {
        next_event = events[i]
        continue
      } else {
        if (new Date(next_event.start_time).valueOf() > new Date(events[i].start_time).valueOf()) {
          next_event = events[i]
        }
      }
    }
    res.json(next_event)
  })
})


app.listen(3000)
console.log('Listening on port 3000...')
