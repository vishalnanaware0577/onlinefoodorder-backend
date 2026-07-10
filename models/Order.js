const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  delivery_partner_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  delivery_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  payment_method: {
    type: DataTypes.ENUM('cod', 'razorpay'),
    defaultValue: 'cod'
  },

  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },

  order_status: {
    type: DataTypes.ENUM(
      'placed',
      'accepted',
      'preparing',
      'ready',
      'picked_up',
      'delivered',
      'cancelled'
    ),
    defaultValue: 'placed'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

module.exports = Order;