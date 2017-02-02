'use strict';

// Modules
const express = require('express'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  session = require('express-session'),
  SequelizeStore = require('connect-session-sequelize')(session.Store),
  passport = require('passport'),

  // Local dependencies
  models = require('./models'),

  // Const vars
  app = express(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  PORT = process.env.PORT || 3000,

  // Handlebars
  exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body parser init
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Run Morgan for Logging
app.use(logger('dev'));

// Socket.IO init (pass to express router)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Passport init
if (process.env.AMAZON_CLIENT_ID) {

  // Amazon Session
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
} else {

  // Local test session
  app.use(session(
    {
      secret: 'secret',
      cookie: { maxAge: 3600000 },
      resave: true,
      saveUninitialized: true
    }
  ));
}

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Sequelize init
// models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
// .then(function(){
// 	return models.sequelize.sync({force:true})
// })
models.sequelize.sync();

// Route for static content
app.use(express.static(process.cwd() + '/public'));

// Controller routes
const routes = {
      index: require('./controllers/index.js'),
      account: require('./controllers/account.js'),
      amazon: require('./controllers/amazon.js'),
      pets: require('./controllers/pets.js'),
      sockets: require('./controllers/sockets.js'),
      seeds: require('./controllers/seeds.js')
};

app.use('/', routes.index);
app.use('/account', routes.account);
app.use('/amazon', routes.amazon);
app.use('/sockets', routes.sockets);
app.use('/pets', routes.pets);
app.use('/seeds', routes.seeds);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// Socket.io
io.on('connection', function (socket) {
  console.log('user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// Init server
server.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});
