const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/add',
  protect,
  authorize('customer'),
  cartController.addToCart
);

router.get(
  '/my',
  protect,
  authorize('customer'),
  cartController.getMyCart
);

router.put(
  '/item/:cart_item_id',
  protect,
  authorize('customer'),
  cartController.updateCartItem
);

router.delete(
  '/item/:cart_item_id',
  protect,
  authorize('customer'),
  cartController.removeCartItem
);

router.delete(
  '/clear',
  protect,
  authorize('customer'),
  cartController.clearCart
);

module.exports = router;