'use strict';
module.exports = function (sequelize, DataTypes) {
  var Pets = sequelize.define('Pets', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
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
          Pets.belongsTo(models.Moves, { as: 'move1', foreignKey: 'move1id' });
          Pets.belongsTo(models.Moves, { as: 'move2', foreignKey: 'move2id' });
          Pets.belongsTo(models.Moves, { as: 'move3', foreignKey: 'move3id' });
          Pets.belongsTo(models.Moves, { as: 'move4', foreignKey: 'move4id' });
        }
      }
    });
  return Pets;
};