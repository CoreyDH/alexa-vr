'use strict';

// Modules
const express = require('express'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  session = require('express-session'),
  flash = require('connect-flash'),
  SequelizeStore = require('connect-session-sequelize')(session.Store),
  passport = require('passport'),

  // Local dependencies
  routes = require('./controllers/index.js'),
  amazonRoutes = require('./controllers/amazon.js'),
  models = require('./models'),

  // Const vars
  app = express(),
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
      secret:'secret',
      cookie: { maxAge: 3600000 },
      resave: true,
      saveUninitialized: true
    }
  ));

}

// Connect Flash
// app.use(flash());

// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
// });

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Sequelize init
// seeder(models);
models.sequelize.sync();

// Route for static content
app.use(express.static(process.cwd() + '/public'));

// Controller routes
app.use('/', routes);
app.use('/amazon', amazonRoutes);

// Init server
app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});
