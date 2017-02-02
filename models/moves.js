'use strict';
module.exports = function (sequelize, DataTypes) {
  var Moves = sequelize.define('Moves', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type1: DataTypes.STRING,
    type2: DataTypes.STRING,
    type3: DataTypes.STRING,
    power: DataTypes.INTEGER,
    accuracy: DataTypes.INTEGER,
    pp: DataTypes.INTEGER
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      }
    });
  return Moves;
};