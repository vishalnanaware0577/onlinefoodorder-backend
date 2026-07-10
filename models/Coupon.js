const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coupon = sequelize.define('Coupon', {
  coupon_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  coupon_code: {
    type: DataTypes.STRING,
    allowNull: false
  },

  discount_type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false
  },

  discount_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  min_order_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },

  max_discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },

  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

module.exports = Coupon;