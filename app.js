require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var authRoutes = require('./routes/authRoutes');
var testRoutes = require('./routes/testRoutes');
var restaurantRoutes = require('./routes/restaurantRoutes');
var documentRoutes = require('./routes/documentRoutes');
var foodRoutes = require('./routes/foodRoutes');
var cartRoutes = require('./routes/cartRoutes');
var orderRoutes = require('./routes/orderRoutes');
var paymentRoutes = require('./routes/paymentRoutes');
var reviewRoutes = require('./routes/reviewRoutes');
var couponRoutes = require('./routes/couponRoutes');
var notificationRoutes = require('./routes/notificationRoutes');
var profileRoutes = require('./routes/profileRoutes');
var wishlistRoutes = require('./routes/wishlistRoutes');


var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api', (req, res) => {
  res.send('Online Food Ordering Backend API Running...');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/wishlist', wishlistRoutes);


module.exports = app;