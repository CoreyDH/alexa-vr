'use strict';

// Modules
const express = require('express'),
    // Models
    models = require('../models'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,

    // Const vars
    router = express.Router();


// Routes
router.get('/', (req, res) => {

    console.log('User', req.user);

    if (req.user) {

        const user = req.user.dataValues;
        console.log(user);

        res.render('account', {
            email: user.email,
        });
    } else {
        res.redirect('/account/login');
    }

});

// router.get('/login', (req, res) => res.render('login'));
// router.get('/register', (req, res) => res.render('register'));

// Check if user is logged in
router.get('/status', (req, res) => {
    if (req.user) {
        res.json({
            login: {
                username: req.user.username,
                email: req.user.email
            }
        });
    } else {
        res.send(false);
    }
});

// Create User
router.post('/register', function (req, res) {

    const username = req.body.username,
        email = req.body.email,
        password = req.body.password,
        password2 = req.body.password2;

    // Validate form fields
    req.checkBody('username', 'Username cannot be empty!').notEmpty();
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
                    username: username
                },
                defaults: {
                    email: email,
                    password: password
                }
            }).spread(function (account, created) {

                // Check if creation was successful
                if (created) {
                    //   console.log(account.get({ plain: true }), created);
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

// Passport Strategy
passport.use(new LocalStrategy(
    function (username, password, done) {
        models.User.findOne({
            where: {
                username: username
            }
        }).then(function (user) {
            // if (err) { return done(err); }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            user.validPassword(password, function (err, isMatch) {
                if (err) throw err;

                // console.log('Match check', isMatch);

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password.' });
                }
            });
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    models.User.findOne({ where: { id: id } }).then(function (user) {
        done(null, user);
    });
});

// Verify login
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/#/account',
        failureRedirect: '/#/login',
        failureFlash: false
    })
);

// Log out
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;
