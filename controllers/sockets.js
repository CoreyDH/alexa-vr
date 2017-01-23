'use strict';

// Modules
const express = require('express'),
  // Const vars
  router = express.Router();

// Routes
router.get('/', (req, res) => {
  req.io.emit('news', { hello: 'world' });
  req.io.on('my other event', function (data) {
    console.log(data);
  });
  res.json({ status: 'OK' });
});

module.exports = router;