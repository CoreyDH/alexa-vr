'use strict';
module.exports = function(sequelize, DataTypes) {
  var UserPets = sequelize.define('UserPets', {
    name: DataTypes.STRING,
    loyalty: DataTypes.INTEGER,
    health: DataTypes.INTEGER,
    happiness: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        UserPets.belongsTo( models.Pets, { onDelete: 'CASCADE' } );
      }
    }
  });
  return UserPets;
};
