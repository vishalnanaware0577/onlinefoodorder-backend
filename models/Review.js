const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  review_id: {
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

  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reviews',
  timestamps: true
});

module.exports = Review;