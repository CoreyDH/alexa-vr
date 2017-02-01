'use strict';

// Modules
const express = require('express'),

    // Models
    models = require('../models'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    auth = require('../helpers/auth.js'),

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
router.get('/user', (req, res) => {
    if (req.user) {
        res.json({
            username: req.user.username,
            email: req.user.email
        });
    } else {
        res.json({});
    }
});

router.get('/register', (req, res) => {
    const fields = [
        {
            name: 'username',
            label: 'Username',
            placeholder: 'Create a username.',
            type: 'text'
        },
        {
            name: 'email',
            label: 'Email',
            placeholder: 'Enter your email here.',
            type: 'text'
        },
        {
            name: 'password',
            label: 'Password',
            placeholder: 'Enter your password here.',
            type: 'password'
        },
        {
            name: 'password2',
            label: 'Confirm Password',
            placeholder: 'Confirm your password.',
            type: 'password'
        }
    ];

    res.json(fields);
});

// Create User
router.post('/register', function (req, res) {

    const username = req.body.username.trim(),
        email = req.body.email.trim(),
        password = req.body.password.trim(),
        password2 = req.body.password2.trim();

    // Validate form fields
    req.checkBody('username', 'Username cannot be empty!').notEmpty();
    req.checkBody('email', 'E-mail cannot be empty!').notEmpty();
    req.checkBody('email', 'E-mail is not valid.').isEmail();
    req.checkBody('password', 'Password cannot be empty!').notEmpty();
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

    const errors = req.validationErrors();

    console.log(errors);
    
    // If there are errors, return to page with error message(s)
    if (errors) {
        res.json({ errors: errors });
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
                    const token = auth.generateToken(account.get({ plain: true }));

                    res.json({
                        user: account,
                        token: token
                    });

                } else {
                    res.json({
                        errors: [{
                            param: 'username',
                            msg: 'Username already exists!'
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
            // TODO ADD TOKEN

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            user.validPassword(password, function (err, isMatch) {
                if (err) throw err;

                if (isMatch) {
                    const token = auth.generateToken(user);

                    return done(null, token, user);
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
router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, token, user) {
        if (err) { return next(err); }
        if (!user) { 
            return res.json({
                success: false,
                message: 'User or password does not match.'
            }); 
        }

        req.logIn(user, function (err) {
            if (err) { return next(err); }

            return res.json({
                success: true,
                message: 'You have sucessfully logged in!',
                token,
                user: user
            });
        });
    })(req, res, next);
});

// Log out
router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

// router.post('/check-token', function (req, res, next) {
//     passport.authenticate('local', function (err, token, user) {
//         if (err) { return next(err); }
//         if (!user) { 
//             return res.json({
//                 success: false,
//                 message: 'User or password does not match.'
//             }); 
//         }

//         req.logIn(user, function (err) {
//             if (err) { return next(err); }

//             return res.json({
//                 success: true,
//                 message: 'You have sucessfully logged in!',
//                 token,
//                 user: user
//             });
//         });
//     })(req, res, next);
// });

router.post('/pets', (req, res) => {

    if (req.user && req.body.pet) {
        const pet = req.body.pet;

        models.User.findOne({
            where: {
                email: req.user.email
            }
        }).then((userInstance) => {
            // TODO Find requested pet and add to User key

            models.Pets.findOne({
                where: pet,
                include: [
                    { model: models.Moves, as: 'move1' },
                    { model: models.Moves, as: 'move2' },
                    { model: models.Moves, as: 'move3' },
                    { model: models.Moves, as: 'move4' }
                ]
            }).then((petInstance) => {

                let userPetEntry = {
                    name: petInstance.name,
                    move1_pp: petInstance.move1.pp,
                    move2_pp: petInstance.move2.pp,
                    move3_pp: petInstance.move3.pp,
                    move4_pp: petInstance.move4.pp
                };

                models.UserPets.create(userPetEntry).then((userPetInstance) => {
                    userInstance.addPet(userPetInstance)
                    userPetInstance.setUserMove1(petInstance.move1);
                    userPetInstance.setUserMove2(petInstance.move2);
                    userPetInstance.setUserMove3(petInstance.move3);
                    userPetInstance.setUserMove4(petInstance.move4);
                    userPetInstance.setPet(petInstance);

                    res.json(userPetInstance);
                });
            });

        });

    } else {
        res.json({
            error: 'User session not stored or Pet information not requested!'
        })
    }

});

// Check if user is logged in
router.get('/pets', (req, res) => {


    if (req.user) {
        models.User.findOne({
            where: {
                username: req.user.username
            }
        }).then((user) => {

            models.UserPets.findAll({
                where: {
                    UserId: user.id
                },
                include: [
                    { model: models.Pets },
                    { model: models.Moves, as: 'userMove1' },
                    { model: models.Moves, as: 'userMove2' },
                    { model: models.Moves, as: 'userMove3' },
                    { model: models.Moves, as: 'userMove4' }
                ]
            }).then((userPets) => {

                console.log('User pets for ', user.username, ' pets: ', userPets);
                res.json(userPets);
            })

        });
    } else {
        res.send(false);
    }
});

module.exports = router;
