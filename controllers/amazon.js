'use strict';

// Modules
const express = require('express'),
    // Models
    models = require('../models'),
    passport = require('passport'),
    AmazonStrategy = require('passport-amazon').Strategy,

    // Const vars
    router = express.Router();

if (process.env.AMAZON_CLIENT_ID) {
    // Authentication strategy
    passport.use(new AmazonStrategy(
        {
            clientID: process.env.AMAZON_CLIENT_ID,
            clientSecret: process.env.AMAZON_CLIENT_SECRET,
            callbackURL: "https://alexaquiz.herokuapp.com/auth/amazon/callback"
        },
        (accessToken, refreshToken, profile, done) => {  // Executed when user data is returned from Amazon
            models.User.findOrCreate({
                where: { AmazonId: profile.id }
            }).spread((user, wasCreated) => {
                if (!user) return done(null, false);

                else {
                    user.update({ displayName: profile.displayName }).then(user =>
                        done(null, user)
                    );
                }
            });
        }
    ));

    // AmazonId is stored when user authenticates
    passport.serializeUser((user, done) => {
        done(null, user.AmazonId);
    });

    // User data pulled out of database on subsequent requests
    passport.deserializeUser((AmazonId, done) => {
        models.User.findOne({ AmazonId: AmazonId }).then(user =>
            done(null, user)
        );
    });

    router.get('/auth', passport.authenticate('amazon', { scope: ['profile'] }));
    router.get('/auth/callback', passport.authenticate('amazon', { successRedirect: '/user_results', failureRedirect: '/' }));
}

module.exports = router;
