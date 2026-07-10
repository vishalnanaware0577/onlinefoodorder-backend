const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Wishlist = sequelize.define('Wishlist', {
  wishlist_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'wishlist',
  timestamps: true
});

module.exports = Wishlist;