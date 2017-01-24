'use strict';
module.exports = function (sequelize, DataTypes) {
  var Pets = sequelize.define('Pets', {
    name: DataTypes.STRING,
    type1: DataTypes.STRING,
    type2: DataTypes.STRING,
    type3: DataTypes.STRING,
    hp: DataTypes.INTEGER,
    attack: DataTypes.INTEGER,
    defense: DataTypes.INTEGER,
    special_attack: DataTypes.INTEGER,
    special_defense: DataTypes.INTEGER
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          Pets.belongsTo(models.Moves, { as: 'petMove1', foreignKey: 'move1' });
          Pets.belongsTo(models.Moves, { as: 'petMove2', foreignKey: 'move2' });
          Pets.belongsTo(models.Moves, { as: 'petMove3', foreignKey: 'move3' });
          Pets.belongsTo(models.Moves, { as: 'petMove4', foreignKey: 'move4' });
        }
      }
    });
  return Pets;
};