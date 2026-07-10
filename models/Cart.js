const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define('Cart', {
  cart_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'carts',
  timestamps: true
});

module.exports = Cart;