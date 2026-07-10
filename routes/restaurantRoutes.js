const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');
const createUpload = require('../middleware/uploadMiddleware');

const uploadRestaurant = createUpload('restaurant');

router.post(
  '/',
  protect,
  authorize('hotel_owner'),
  uploadRestaurant.single('image'),
  restaurantController.createRestaurant
);

router.get(
  '/my',
  protect,
  authorize('hotel_owner'),
  restaurantController.getMyRestaurants
);

router.put(
  '/:id',
  protect,
  authorize('hotel_owner'),
  uploadRestaurant.single('image'),
  restaurantController.updateRestaurant
);

router.delete(
  '/:id',
  protect,
  authorize('hotel_owner'),
  restaurantController.deleteRestaurant
);

router.get(
  '/',
  restaurantController.getAllRestaurantsForCustomer
);

module.exports = router;