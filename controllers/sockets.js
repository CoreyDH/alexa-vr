'use strict';

// Modules
const express = require('express'),
      router  = express.Router();

// Routes
router.get('/attack/:move', (req, res) => {
  const moveName = req.params.move;
  console.log(moveName);

  req.io.emit('attack', { move: moveName });
  res.json({ status: 'OK' });
});

router.get('/restart', (req, res) => {
  console.log('game restart');

  req.io.emit('restart', {});
  res.json({ status: 'OK' });
});

module.exports = router;