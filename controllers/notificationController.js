const { Notification } = require('../models');

exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.user_id },
      order: [['notification_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Notifications fetched successfully.',
      data: notifications
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Notifications fetch failed.',
      data: error.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const notification = await Notification.findOne({
      where: {
        notification_id,
        user_id: req.user.user_id
      }
    });

    if (!notification) {
      return res.status(404).json({
        error: true,
        message: 'Notification not found.'
      });
    }

    notification.is_read = true;
    await notification.save();

    return res.status(200).json({
      error: false,
      message: 'Notification marked as read.',
      data: notification
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Notification update failed.',
      data: error.message
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.user_id } }
    );

    return res.status(200).json({
      error: false,
      message: 'All notifications marked as read.'
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Notifications update failed.',
      data: error.message
    });
  }
};