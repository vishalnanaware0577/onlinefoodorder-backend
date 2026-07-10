const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/create-order',
  protect,
  authorize('customer'),
  paymentController.createRazorpayOrder
);

router.post(
  '/verify',
  protect,
  authorize('customer'),
  paymentController.verifyRazorpayPayment
);

module.exports = router;