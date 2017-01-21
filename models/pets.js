'use strict';
module.exports = function(sequelize, DataTypes) {
  var Pets = sequelize.define('Pets', {
    type: DataTypes.STRING,
    base_loyalty: DataTypes.INTEGER,
    base_health: DataTypes.INTEGER,
    base_happiness: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Pets;
};