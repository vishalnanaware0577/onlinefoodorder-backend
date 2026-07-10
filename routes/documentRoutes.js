const express = require('express');
const router = express.Router();

const documentController = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const createUpload = require('../middleware/uploadMiddleware');

const uploadDocuments = createUpload('documents');

router.post(
  '/upload',
  protect,
  authorize('hotel_owner'),
  uploadDocuments.fields([
    { name: 'fssai_license', maxCount: 1 },
    { name: 'aadhaar_card', maxCount: 1 },
    { name: 'shop_license', maxCount: 1 }
  ]),
  documentController.uploadRestaurantDocuments
);

module.exports = router;