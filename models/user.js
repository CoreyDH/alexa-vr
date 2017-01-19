'use strict';
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
    {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
          User.hasMany(models.UserPets, { as: 'Pet', onDelete: 'CASCADE' });
        },
        hooks: {
          beforeCreate: function (user, options) {
            // Hash password here
          }
        }
      }
    });
  return User;
};
