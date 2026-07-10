const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post(
  '/place',
  protect,
  authorize('customer'),
  orderController.placeOrder
);

router.get(
  '/my',
  protect,
  authorize('customer'),
  orderController.getMyOrders
);

router.get(
  '/hotel/my',
  protect,
  authorize('hotel_owner'),
  orderController.getHotelOrders
);

router.patch(
  '/hotel/status/:order_id',
  protect,
  authorize('hotel_owner'),
  orderController.updateHotelOrderStatus
);

router.get(
  '/delivery/available',
  protect,
  authorize('delivery_partner'),
  orderController.getAvailableDeliveryOrders
);

router.patch(
  '/delivery/accept/:order_id',
  protect,
  authorize('delivery_partner'),
  orderController.acceptDeliveryOrder
);

router.get(
  '/delivery/my',
  protect,
  authorize('delivery_partner'),
  orderController.getMyDeliveryOrders
);

router.patch(
  '/delivery/delivered/:order_id',
  protect,
  authorize('delivery_partner'),
  orderController.markDelivered
);
router.patch(
  '/cancel/:order_id',
  protect,
  authorize('customer'),
  orderController.cancelMyOrder
);
module.exports = router;