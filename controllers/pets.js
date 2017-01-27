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

router.post('/save', (req, res) => {

    if (req.user && req.body.pet) {
        const user = req.user.dataValues,
            pet = req.body.pet;
        
        models.User.findOne({
            where: {
                email: user.email
            }
        }).then((account) => {
            // TODO Find requested pet and add to User key

        });



    } else {
        res.json({
            error: 'User session not stored or Pet information not requested!'
        })
    }

});

module.exports = router;