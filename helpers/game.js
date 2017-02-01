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
    playerAttack: function (state, moveName) {
        const attacker = state.player,
              defender = state.cpu,
              move     = state.player[moveName],
              damage   = getDamage(attacker, defender, move);
        
        state.cpu.hp - damage < 0 ? state.cpu.hp = 0 : state.cpu.hp -= damage;
        state.battleText =
            `${attacker.name} uses ${move.name} and does ${damage} damage
            `;
        if (state.cpu.hp === 0) state.battleText += `${defender.name} has fainted!`;

        return state;
    },
    playerHPWidth: function (state) {
        return HP_MAX_WIDTH * state.player.hp / state.player.hpMax
    },
    playerHPColor: function (state) {
        const hpPercent = state.player.hp / state.player.hpMax;
        
        if      (hpPercent < 0.25) return 'red';
        else if (hpPercent < 0.5)  return 'yellow';
        else                       return 'green';
    },
    cpuAttack: function (state) {
        const attacker = state.cpu,
              defender = state.player,
              move     = state.cpu['move' + Math.ceil(Math.random() * 4)],
              damage   = getDamage(attacker, defender, move);
        
        state.player.hp - damage < 0 ? state.player.hp = 0 : state.player.hp -= damage;
        state.battleText =
            `${attacker.name} uses ${move.name} and does ${damage} damage
            `;
        if (state.cpu.hp === 0) state.battleText += `${defender.name} has fainted!`;

        return state;
    }
}