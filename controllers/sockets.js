'use strict';

// Modules
const express = require('express'),
      router  = express.Router();

// Routes
router.get('/attack', (req, res) => {
  console.log('attack');
  req.io.emit('attack', { move: 'move1' });
  res.json({ status: 'OK' });
});

module.exports = router;