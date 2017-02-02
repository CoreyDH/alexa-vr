'use strict';

// Constants
const LEVEL        = 20,
      LEVEL_MOD    = ((2 * LEVEL) + 10) / 250,
      HP_MAX_WIDTH = 1.6;

// Damage calculation
function getDamage (attacker, defender, move) {
    
    // Random damage modifier
    function modifier () { return ((Math.random() / 6.666666667) + .85) }

    return Math.round((LEVEL_MOD * (attacker.attack / defender.defense) * move.power + 2) * modifier());
}


module.exports = {
    attack: function (state, isPlayer, moveName) {
        const attacker = isPlayer ? state.player : state.cpu,
              defender = isPlayer ? state.cpu    : state.player,
              move     = isPlayer ? state.player[moveName] : state.cpu['move' + Math.ceil(Math.random() * 4)], 
              damage   = getDamage(attacker, defender, move);
        
        defender.hp - damage < 0 ? defender.hp = 0 : defender.hp -= damage;
        state.battleText =
            `${attacker.name} uses ${move.name}.
            `;
        if (defender.hp === 0) state.battleText += `${defender.name} has fainted!`;
        if (!isPlayer) state.lastMove = move.name;

        return state;
    },
    hpWidth: function (state, isPlayer) {
        const pet = isPlayer ? state.player : state.cpu;
        return HP_MAX_WIDTH * pet.hp / pet.hpMax
    },
    hpColor: function (state, isPlayer) {
        const pet = isPlayer ? state.player : state.cpu,
              pct = pet.hp / pet.hpMax;
        
        if      (pct < 0.25) return 'red';
        else if (pct < 0.5)  return 'yellow';
        else                 return 'green';
    }
}