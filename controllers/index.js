'use strict';

// Modules
const express = require('express'),
  // Models
  models = require('../models'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

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

// passport.use(new LocalStrategy({
//   usernameField: 'email'
// },
//   function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       // if (!user.validPassword(password)) {
//       //   return done(null, false, { message: 'Incorrect password.' });
//       // }
//       return done(null, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

// Web API
router.get('/', (req, res) => res.render('index'));
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Create User
router.post('/register', function (req, res) {

  const email = req.body.email,
    password = req.body.password,
    password2 = req.body.password2;
  
  // Validate form fields
  req.checkBody('email', 'E-mail cannot be empty!').notEmpty();
  req.checkBody('email', 'E-mail is not valid.').isEmail();
  req.checkBody('password', 'Password cannot be empty!').notEmpty();
  req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

  const errors = req.validationErrors();
  // If there are errors, return to page with error message(s)
  if (errors) {
    res.render('register', { errors: errors });
  } else {
    // Check if user already exists, if not insert into database.
    models.User.sync().then(function () {
      models.User.findOrCreate({
        where: {
          email: email
        },
        defaults: {
          password: password
        }
      }).spread(function (account, created) {

        // Check if creation was successful
        if (created) {
          console.log(account.get({ plain: true }), created);
          res.json(account.get());
        } else {
          res.render('register', {
            errors: [{
              msg: 'E-mail already exists in database!'
            }]
          })
        }
      });

    });
  }

});

// // Verify login
// router.post('/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   })
// );

module.exports = router;
