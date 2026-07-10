const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/customer', protect, authorize('customer'), (req, res) => {
  res.json({
    error: false,
    message: 'Customer access successful.',
    user: req.user
  });
});

router.get('/hotel-owner', protect, authorize('hotel_owner'), (req, res) => {
  res.json({
    error: false,
    message: 'Hotel owner access successful.',
    user: req.user
  });
});

router.get('/delivery-partner', protect, authorize('delivery_partner'), (req, res) => {
  res.json({
    error: false,
    message: 'Delivery partner access successful.',
    user: req.user
  });
});

module.exports = router;