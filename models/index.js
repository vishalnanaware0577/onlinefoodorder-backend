const sequelize = require('../config/db');

const db = {};

db.sequelize = sequelize;

db.User = require('./User');
db.Restaurant = require('./Restaurant');

db.User.hasMany(db.Restaurant, {
  foreignKey: 'owner_id',
  as: 'restaurants'
});

db.Restaurant.belongsTo(db.User, {
  foreignKey: 'owner_id',
  as: 'owner'
});

db.RestaurantDocument = require('./RestaurantDocument');

db.Restaurant.hasOne(db.RestaurantDocument, {
  foreignKey: 'restaurant_id',
  as: 'documents'
});

db.RestaurantDocument.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

db.FoodItem = require('./FoodItem');

db.Restaurant.hasMany(db.FoodItem, {
  foreignKey: 'restaurant_id',
  as: 'foodItems'
});

db.FoodItem.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

db.Cart = require('./Cart');
db.CartItem = require('./CartItem');

db.User.hasOne(db.Cart, {
  foreignKey: 'customer_id',
  as: 'cart'
});

db.Cart.belongsTo(db.User, {
  foreignKey: 'customer_id',
  as: 'customer'
});

db.Cart.hasMany(db.CartItem, {
  foreignKey: 'cart_id',
  as: 'items'
});

db.CartItem.belongsTo(db.Cart, {
  foreignKey: 'cart_id',
  as: 'cart'
});

db.FoodItem.hasMany(db.CartItem, {
  foreignKey: 'food_id',
  as: 'cartItems'
});

db.CartItem.belongsTo(db.FoodItem, {
  foreignKey: 'food_id',
  as: 'food'
});

db.Order = require('./Order');
db.OrderItem = require('./OrderItem');

db.User.hasMany(db.Order, {
  foreignKey: 'customer_id',
  as: 'customerOrders'
});

db.Order.belongsTo(db.User, {
  foreignKey: 'customer_id',
  as: 'customer'
});

db.Restaurant.hasMany(db.Order, {
  foreignKey: 'restaurant_id',
  as: 'orders'
});

db.Order.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

db.User.hasMany(db.Order, {
  foreignKey: 'delivery_partner_id',
  as: 'deliveryOrders'
});

db.Order.belongsTo(db.User, {
  foreignKey: 'delivery_partner_id',
  as: 'deliveryPartner'
});

db.Order.hasMany(db.OrderItem, {
  foreignKey: 'order_id',
  as: 'items'
});

db.OrderItem.belongsTo(db.Order, {
  foreignKey: 'order_id',
  as: 'order'
});

db.FoodItem.hasMany(db.OrderItem, {
  foreignKey: 'food_id',
  as: 'orderItems'
});

db.OrderItem.belongsTo(db.FoodItem, {
  foreignKey: 'food_id',
  as: 'food'
});

db.Review = require('./Review');

db.User.hasMany(db.Review, {
  foreignKey: 'customer_id',
  as: 'reviews'
});

db.Review.belongsTo(db.User, {
  foreignKey: 'customer_id',
  as: 'customer'
});

db.Restaurant.hasMany(db.Review, {
  foreignKey: 'restaurant_id',
  as: 'reviews'
});

db.Review.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

db.Order.hasOne(db.Review, {
  foreignKey: 'order_id',
  as: 'review'
});

db.Review.belongsTo(db.Order, {
  foreignKey: 'order_id',
  as: 'order'
});

db.Coupon = require('./Coupon');

db.Restaurant.hasMany(db.Coupon, {
  foreignKey: 'restaurant_id',
  as: 'coupons'
});

db.Coupon.belongsTo(db.Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

db.Notification = require('./Notification');

db.User.hasMany(db.Notification, {
  foreignKey: 'user_id',
  as: 'notifications'
});

db.Notification.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

db.Wishlist = require('./Wishlist');

db.User.hasMany(db.Wishlist, {
  foreignKey: 'customer_id',
  as: 'wishlist'
});

db.Wishlist.belongsTo(db.User, {
  foreignKey: 'customer_id',
  as: 'customer'
});

db.FoodItem.hasMany(db.Wishlist, {
  foreignKey: 'food_id',
  as: 'wishlistItems'
});

db.Wishlist.belongsTo(db.FoodItem, {
  foreignKey: 'food_id',
  as: 'food'
});

module.exports = db;