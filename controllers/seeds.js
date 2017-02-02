'use strict';

// Modules
const express = require('express'),
  // Models
  models = require('../models'),

  // Const vars
  router = express.Router();


// Routes
router.get('/pets', (req, res) => {

  const pikachu = {
    name: 'Pikachu',
    type1: 'Electric',
    hp: 35,
    attack: 55,
    defense: 40,
    special_attack: 50,
    special_defense: 50,
  };

  const alexa = {
    name: 'Alexa',
    type1: 'Normal',
    hp: 55,
    attack: 30,
    defense: 70,
    special_attack: 40,
    special_defense: 60
  }

  models.Pets.create(pikachu).then(function (petInstance) {

    models.Moves.findOne({ where: { name: 'Tackle' } }).then((move) => { petInstance.setMove1(move); });
    models.Moves.findOne({ where: { name: 'Thunder Shock' } }).then((move) => { petInstance.setMove2(move); });
    models.Moves.findOne({ where: { name: 'Quick Attack' } }).then((move) => { petInstance.setMove3(move); });
    models.Moves.findOne({ where: { name: 'Thunder' } }).then((move) => { petInstance.setMove4(move); });

  });

  models.Pets.create(alexa).then(function (petInstance) {

    models.Moves.findOne({ where: { name: 'Tackle' } }).then((move) => { petInstance.setMove1(move); });
    models.Moves.findOne({ where: { name: 'Lights Off' } }).then((move) => { petInstance.setMove2(move); });
    models.Moves.findOne({ where: { name: 'Sonic Boom' } }).then((move) => { petInstance.setMove3(move); });
    models.Moves.findOne({ where: { name: 'Order Package' } }).then((move) => { petInstance.setMove4(move); });

  });


});

router.get('/moves', (req, res) => {

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
    if (created) {
      res.json(created);
    } else {
      res.send('Failed creating seeds.');
    }
  });
});

module.exports = router;
