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
        const pet = req.body.pet;
        
        models.User.findOne({
            where: {
                email: req.user.email
            }
        }).then((userInstance) => {
            // TODO Find requested pet and add to User key

            models.Pets.findOne({
                where: pet,
                include: [
                    { model: models.Moves, as: 'move1' },
                    { model: models.Moves, as: 'move2' },
                    { model: models.Moves, as: 'move3' },
                    { model: models.Moves, as: 'move4' }
                ]
            }).then((petInstance) => {

                let userPetEntry = {
                    name: petInstance.name,
                    move1_pp: petInstance.move1.pp,
                    move2_pp: petInstance.move2.pp,
                    move3_pp: petInstance.move3.pp,
                    move4_pp: petInstance.move4.pp
                };

                models.UserPets.create(userPetEntry).then((userPetInstance) => {
                    userInstance.addPet(userPetInstance)
                    userPetInstance.setUserMove1(petInstance.move1);
                    userPetInstance.setUserMove2(petInstance.move2);
                    userPetInstance.setUserMove3(petInstance.move3);
                    userPetInstance.setUserMove4(petInstance.move4);
                    userPetInstance.setPet(petInstance);

                    res.json(userPetInstance);
                });
            });

        });

    } else {
        res.json({
            error: 'User session not stored or Pet information not requested!'
        })
    }

});

module.exports = router;