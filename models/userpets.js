'use strict';
module.exports = function (sequelize, DataTypes) {
  var UserPets = sequelize.define('UserPets', {
    name: DataTypes.STRING,
    move1_pp: DataTypes.INTEGER,
    move2_pp: DataTypes.INTEGER,
    move3_pp: DataTypes.INTEGER,
    move4_pp: DataTypes.INTEGER
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          UserPets.belongsTo(models.Pets, { onDelete: 'CASCADE' });
          UserPets.belongsTo(models.Moves, { as: 'userMove1', foreignKey: 'move1id' });
          UserPets.belongsTo(models.Moves, { as: 'userMove2', foreignKey: 'move2id' });
          UserPets.belongsTo(models.Moves, { as: 'userMove3', foreignKey: 'move3id' });
          UserPets.belongsTo(models.Moves, { as: 'userMove4', foreignKey: 'move4id' });
        }
      }
    });
  return UserPets;
};
