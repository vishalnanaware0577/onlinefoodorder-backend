const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FoodItem = sequelize.define('FoodItem', {
  food_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  food_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  food_type: {
    type: DataTypes.ENUM('veg', 'non_veg'),
    allowNull: false
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true
  },

  is_available: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'food_items',
  timestamps: true
});

module.exports = FoodItem;