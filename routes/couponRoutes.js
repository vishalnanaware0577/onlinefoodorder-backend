const express = require('express');
const router = express.Router();

const couponController = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/',
  protect,
  authorize('hotel_owner'),
  couponController.createCoupon
);

router.get(
  '/my',
  protect,
  authorize('hotel_owner'),
  couponController.getMyCoupons
);

router.put(
  '/:coupon_id',
  protect,
  authorize('hotel_owner'),
  couponController.updateCoupon
);

router.delete(
  '/:coupon_id',
  protect,
  authorize('hotel_owner'),
  couponController.deleteCoupon
);

router.post(
  '/apply',
  protect,
  authorize('customer'),
  couponController.applyCoupon
);

module.exports = router;