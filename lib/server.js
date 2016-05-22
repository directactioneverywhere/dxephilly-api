try {
  var env = require('./env.js')
} catch(e) {
  var env = process.env
}

const express = require('express')
const fs = require('fs')
const request = require('request')
const bodyParser = require('body-parser')
const stripe = require('stripe')(env.STRIPE_SECRET_KEY)

const FACEBOOK_ACCESS_TOKEN = env.FACEBOOK_ACCESS_TOKEN
const PORT = env.PORT || 3000

var app = express()

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use(bodyParser.urlencoded({ extended: true }))

function get_events(callback) {
  request(
    `https://graph.facebook.com/v2.6/dxephilly?fields=events&access_token=${FACEBOOK_ACCESS_TOKEN}`,
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

app.post('/donate', function(req, res) {
  if (req.body.frequency == 'one-time') {
    var charge = stripe.charges.create({
      amount: req.body.amount * 100,
      currency: 'usd',
      source: req.body.token,
      receipt_email: req.body.email,
      description: 'DxE Philly Donation'
    }, function(error, charge) {
      if (error) {
        res.status(400).json({
          'error': error
        })
      } else {
        res.status(200).json({
          'charge': charge
        })
      }
    });
  } else if (req.body.frequency == 'monthly') {
    stripe.customers.create({
      source: req.body.token,
      plan: 'dxephilly-donation-monthly',
      email: req.body.email,
      quantity: req.body.amount
    }, function(error, customer) {
      if (error) {
        res.status(400).json({
          'error': error
        })
      } else {
        res.status(200).json({
          'customer': customer
        })
      }
    })
  }
})


app.listen(PORT)
console.log(`Listening on port ${PORT}...`)
