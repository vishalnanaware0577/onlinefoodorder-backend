const express = require('express');
const router = express.Router();

const foodController = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/authMiddleware');
const createUpload = require('../middleware/uploadMiddleware');

const uploadFood = createUpload('food');

router.post(
  '/',
  protect,
  authorize('hotel_owner'),
  uploadFood.single('image'),
  foodController.createFoodItem
);

router.get(
  '/restaurant/:restaurant_id',
  foodController.getFoodByRestaurant
);

router.put(
  '/:id',
  protect,
  authorize('hotel_owner'),
  uploadFood.single('image'),
  foodController.updateFoodItem
);

router.delete(
  '/:id',
  protect,
  authorize('hotel_owner'),
  foodController.deleteFoodItem
);

router.patch(
  '/:id/availability',
  protect,
  authorize('hotel_owner'),
  foodController.toggleFoodAvailability
);

module.exports = router;