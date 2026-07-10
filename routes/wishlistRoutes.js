const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlistController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/toggle',
  protect,
  authorize('customer'),
  wishlistController.toggleWishlist
);

router.get(
  '/my',
  protect,
  authorize('customer'),
  wishlistController.getMyWishlist
);

module.exports = router;