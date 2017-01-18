'use strict';

// Modules
const express = require('express'),
  rp = require('request-promise'),

  // Models
  models = require('../models'),

  // Const vars
  router = express.Router();

// Array.prototype.indexOfProp: function (value, prop1, prop2) {
//   for (var i = 0; i < this.length; i++) {
//     if (prop2) if (this[i] && this[i][prop1][prop2] === value) return i;
//     else if (this[i] && this[i][prop1] === value) return i;
//   }
//
//   return -1;
// },

// Web API
router.get('/', (req, res) => res.render('create-user'));

// Create User
router.post('/create-user', function (req, res) {

  // Check if email/password exists
  if (req.body.email && req.body.password) {

    // Check if user already exists
    models.User.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        password: req.body.password
      }
    }).spread(function (account, created) {

      if (created) {
        console.log(account.get({ plain: true }), created);
      } else {
        res.json({
          error: 'User e-mail already exists in database!'
        })
      }
    })
  } else {
    console.log('Empty login fields');
    res.json({
      error: 'E-mail and/or password fields are empty!'
    })
  }

});


module.exports = router;
