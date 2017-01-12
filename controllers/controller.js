'use strict';

// Modules
const express = require('express'),
      rp      = require('request-promise'),

      // Local dependencies
      models  = require('../models'),

      // Const vars
      router  = express.Router();

Array.prototype.indexOfProp = function (value, prop1, prop2) {
  for (var i = 0; i < this.length; i++) {
    if (prop2) if (this[i] && this[i][prop1][prop2] === value) return i;
    else if (this[i] && this[i][prop1] === value) return i;
  }

  return -1;
}

// User ID verification for GET(user)/POST/PUT/DELETE routes
function authUser (req, res) {
  // Set where condition based on environment
  if (process.env.AMAZON_CLIENT_ID) {
    if (req.session.passport) {
      return { where: { AmazonId: req.session.passport.user }};

    // If user is not logged in, deny request
    } else {
      res.json({ error: 'Authentication failed / not logged in' });
    }

  } else {
    return { where: { id: 1 }};
  }
}

// True if user is logged in (or local env), false otherwise
function isLoggedIn (req, res) {
  if (process.env.AMAZON_CLIENT_ID) return !!req.session.passport;
  return true;
}

// Render page with user's first name
function renderWithUsername (uri, req, res) {
  if (isLoggedIn(req, res)) {
    models.User.findOne(authUser(req, res))
    .then(user => res.render(uri, { isLoggedIn: true, username: user.displayName.split(" ")[0] }))

  } else res.render(uri, { isLoggedIn: false });
}

// Fisher-Yates shuffle
function shuffle (arr) {
  let j, temp;

  for (let i = 0; i < arr.length - 1; i++) {
    j = Math.floor(Math.random() * (arr.length - i)) + i;
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  return arr;
}



// Web API
router.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));



module.exports = router;
