'use strict';

const LEVEL     = 20,
      LEVEL_MOD = ((2 * LEVEL) + 10) / 250;

function modifier () { return ((Math.random() / 6.666666666) + .85) }

module.exports = {
    getDamage: function(attacker, defender, move) {
        return Math.round((LEVEL_MOD * (attacker.attack / defender.defense) * move.power + 2) * modifier());
    },
    getSpecialDamage: function() {

    }
}