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

});

router.get('/seed-pets', (req, res) => {

  var entry = {
    name: 'Pikachu',
    type1: 'Electric',
    hp: 35,
    attack: 55,
    defense: 40,
    special_attack: 50,
    special_defense: 50,
  };

  let pikachu = models.Pets.build(entry);

  // models.Pets.create(pikachu, {
  //   include: [models.Moves]
  // }).then((pet) => {
  //   models.Moves.findOne({
  //     where: {
  //       name: 'Tackle'
  //     }
  //   }).then((move) => {
  //     console.log(move);
  //     pet.setMoves(move);
  //   });
  // });

  // models.Pets.findOne({ name: 'Pikachu' }, { include: [models.Moves] }).then((pet) => {

  //   console.log('found pet!', dude);

  //   models.Moves.findOne({ name: 'Tackle' }).then((mover) => {

  //     pika.setMove1(mover);

  //   });
  // });
  models.Moves.findOne({ name: 'Tackle' }, { include: [models.Pets] }).then((move) => {
    console.log(move);

    pikachu.move1 = move;

    pikachu.save().then(function() {
      console.log('work ? ');
    });
  });

});

router.get('/seed-moves', (req, res) => {

  let data = [
    {
      name: 'Thunder Shock',
      type1: 'Electric',
      power: 40,
      accuracy: 100,
      pp: 30
    },
    {
      name: 'Thunder',
      type1: 'Electric',
      power: 110,
      accuracy: 70,
      pp: 10
    },
    {
      name: 'Quick Attack',
      type1: 'Normal',
      power: 40,
      accuracy: 100,
      pp: 30
    },
    {
      name: 'Tackle',
      type1: 'Normal',
      power: 40,
      accuracy: 100,
      pp: 35
    },
    {
      name: 'Sonic Boom',
      type1: 'Normal',
      power: 0,
      accuracy: 90,
      pp: 30
    },
    {
      name: 'Order Package',
      type1: 'Normal',
      power: 0,
      accuracy: 90,
      pp: 30
    },
    {
      name: 'Lights Off',
      type1: 'Normal',
      power: 80,
      accuracy: 100,
      pp: 15
    }
  ]

  models.Moves.bulkCreate(data).then((created) => {
    console.log(created);
    if (created) {
      console.log(created);
      res.json(created);
    } else {
      res.send('Failed creating seeds.');
    }
  });
});

module.exports = router;
