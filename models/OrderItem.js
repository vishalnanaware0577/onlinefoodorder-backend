const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  food_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  food_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true
});

module.exports = OrderItem;