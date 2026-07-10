const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/',
  protect,
  authorize('customer'),
  reviewController.addReview
);

router.get(
  '/restaurant/:restaurant_id',
  reviewController.getRestaurantReviews
);

router.get(
  '/hotel-owner/my',
  protect,
  authorize('hotel_owner'),
  reviewController.getMyRestaurantReviews
);

module.exports = router;