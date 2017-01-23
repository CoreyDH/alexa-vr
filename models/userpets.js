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
          UserPets.belongsTo(models.Moves, { foreignKey: 'move1' });
          UserPets.belongsTo(models.Moves, { foreignKey: 'move2' });
          UserPets.belongsTo(models.Moves, { foreignKey: 'move3' });
          UserPets.belongsTo(models.Moves, { foreignKey: 'move4' });
        }
      }
    });
  return UserPets;
};