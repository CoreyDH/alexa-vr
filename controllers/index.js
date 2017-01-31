'use strict';

// Modules
const express = require('express'),
  // Models
  models = require('../models'),

  // Const vars
  router = express.Router();


// Routes
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
