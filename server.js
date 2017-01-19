'use strict';

// Modules
const express        = require('express'),
      app            = express(),
      bodyParser     = require('body-parser'),
      logger         = require('morgan'),
      server         = require('http').Server(app),
      io             = require('socket.io')(server),
      session        = require('express-session'),
      SequelizeStore = require('connect-session-sequelize')(session.Store),
      passport       = require('passport'),
      AmazonStrategy = require('passport-amazon').Strategy,

      // Local dependencies
      routes = require('./controllers/controller.js'),
      models = require('./models'),

      // Const vars
      PORT = process.env.PORT || 3000;

// Body parser init
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// Run Morgan for Logging
app.use(logger('dev'));

// Socket.IO init
// server.listen(80);
app.use((req,res,next) => {
  req.io = io;
  next();
});

// Passport init
if (process.env.AMAZON_CLIENT_ID) {
  
  // MySQL session storage
  app.use(session(
    {
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 3600000 },
      resave: false,
      saveUninitialized: false,
      store: new SequelizeStore({
        db: models.sequelize
      })
    }
  ));

  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication strategy
  passport.use(new AmazonStrategy(
    {
      clientID: process.env.AMAZON_CLIENT_ID,
      clientSecret:  process.env.AMAZON_CLIENT_SECRET,
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
          )
        }
      });
    }
  ));

  // AmazonId is stored when user authenticates
  passport.serializeUser((user, done) => {
    done(null, user.AmazonId)
  });

  // User data pulled out of database on subsequent requests
  passport.deserializeUser((AmazonId, done) => {
    models.User.findOne({ AmazonId: AmazonId }).then(user =>
      done(null, user)
    )
  });
  
  app.get('/auth/amazon',          passport.authenticate('amazon', {scope: ['profile']}));
  app.get('/auth/amazon/callback', passport.authenticate('amazon', {successRedirect: '/user_results', failureRedirect: '/'}));
}

// Sequelize init
// seeder(models);
models.sequelize.sync();

// Route for static content
app.use(express.static(process.cwd() + '/public'));

// Controller routes
app.use('/', routes);

// Socket.io
io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

// Init server
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});
