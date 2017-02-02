'use strict';

// Modules
const express = require('express'),
    // Models
    models = require('../models'),

    // Const vars
    router = express.Router();


// Routes
router.get('/:pet?', (req, res) => {

    let search = req.params.pet ? { name: req.params.pet } : {};

    models.Pets.findAll({
        where: search,
        include: [
            { model: models.Moves, as: 'move1' },
            { model: models.Moves, as: 'move2' },
            { model: models.Moves, as: 'move3' },
            { model: models.Moves, as: 'move4' }
        ]
    }).then(function (pets) {
        res.json(pets);
    });

});

module.exports = router;