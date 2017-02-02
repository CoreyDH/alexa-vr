'use strict';

// Modules
const express = require('express'),
  // Models
  models = require('../models'),
  // authorizeCheck = require('../middleware/auth-check'),

  // Const vars
  router = express.Router();
  


// Routes
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
