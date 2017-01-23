'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Moves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      type1: {
        type: Sequelize.STRING
      },
      type2: {
        type: Sequelize.STRING
      },
      type3: {
        type: Sequelize.STRING
      },
      power: {
        type: Sequelize.INTEGER
      },
      accuracy: {
        type: Sequelize.INTEGER
      },
      pp: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Moves');
  }
};