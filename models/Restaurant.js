const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Restaurant = sequelize.define('Restaurant', {
  restaurant_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  restaurant_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  city: {
    type: DataTypes.STRING,
    allowNull: false
  },

  pincode: {
    type: DataTypes.STRING,
    allowNull: false
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },

  is_open: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'restaurants',
  timestamps: true
});

module.exports = Restaurant;