'use strict';

const bcrypt = require('bcryptjs'),
  SALT_WORK_FACTOR = 10;

function getHash(instance, options) {
  // Hash password here
  console.log('Hashing password');

  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR),
    hash = bcrypt.hashSync(instance.password, salt);

  instance.password = hash;
}

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: ["^[a-zA-Z0-9_]+$",'i'],
        isLowercase: true
      }
    },
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
        }
      },
      instanceMethods: {
        generateHash: function (password, callback) {
          bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            bcrypt.hash(password, salt, callback);
          });
        },
        validPassword: function (password, callback) {
          bcrypt.compare(password, this.password, callback)
        }
      },
      hooks: {
        beforeCreate: getHash,
      }
    });
  return User;
};
