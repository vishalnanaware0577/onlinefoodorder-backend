const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      error: false,
      message: 'Profile fetched successfully.',
      data: req.user
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Profile fetch failed.',
      data: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id);

    await user.update({
      name: req.body.name || user.name,
      mobile: req.body.mobile || user.mobile
    });

    return res.status(200).json({
      error: false,
      message: 'Profile updated successfully.',
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profile_image: user.profile_image
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Profile update failed.',
      data: error.message
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'Profile image is required.'
      });
    }

    const user = await User.findByPk(req.user.user_id);

    user.profile_image = `/uploads/profile/${req.file.filename}`;
    await user.save();

    return res.status(200).json({
      error: false,
      message: 'Profile image updated successfully.',
      data: user.profile_image
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Profile image update failed.',
      data: error.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: true,
        message: 'Old password and new password are required.'
      });
    }

    const user = await User.findByPk(req.user.user_id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: 'Old password is incorrect.'
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      error: false,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Password change failed.',
      data: error.message
    });
  }
};