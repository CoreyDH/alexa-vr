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

module.exports = router;