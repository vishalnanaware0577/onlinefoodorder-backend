const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RestaurantDocument = sequelize.define('RestaurantDocument', {
  document_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  fssai_license: {
    type: DataTypes.STRING,
    allowNull: false
  },

  aadhaar_card: {
    type: DataTypes.STRING,
    allowNull: false
  },

  shop_license: {
    type: DataTypes.STRING,
    allowNull: false
  },

  verification_status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'restaurant_documents',
  timestamps: true
});

module.exports = RestaurantDocument;