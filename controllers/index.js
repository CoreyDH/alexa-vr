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

router.post('/save-pets', (req, res) => {

});

router.get('/load-pets', (req, res) => {

  models.Pets.findAll({
    where: {},
    include: [
      { model: models.Moves, as: 'move1' },
      { model: models.Moves, as: 'move2' },
      { model: models.Moves, as: 'move3' },
      { model: models.Moves, as: 'move4' }
    ]
  }).then(function(pets){
    res.json(pets);
  });

});

router.get('/load-user-pets', (req, res) => {

});

module.exports = router;
