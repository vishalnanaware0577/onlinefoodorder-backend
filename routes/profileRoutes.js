const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const createUpload = require('../middleware/uploadMiddleware');

const uploadProfile = createUpload('profile');

router.get('/me', protect, profileController.getProfile);
router.put('/update', protect, profileController.updateProfile);
router.put(
  '/image',
  protect,
  uploadProfile.single('profile_image'),
  profileController.updateProfileImage
);
router.put('/change-password', protect, profileController.changePassword);

module.exports = router;