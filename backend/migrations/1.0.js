'use strict'
const dotEnv = require('dotenv')
const { Sequelize } = require('sequelize');

dotEnv.config()

module.exports = {
  up: async(query) => {
    console.log('running 1.0')
    await query.createTable('items', {
      id: {type: Sequelize.INTEGER, primaryKey: true},
      serial: {type: Sequelize.STRING, allowNull: false},
      price: {type: Sequelize.STRING, allowNull: false},
      action: {type: Sequelize.STRING, allowNull: false},
      consensustime: {type: Sequelize.INTEGER, allowNull: false, unique: true},
      posId: {type: Sequelize.STRING, allowNull: false}
    });
  },
  down: async(query) => {
    await query.dropTable('items');
  }
}
