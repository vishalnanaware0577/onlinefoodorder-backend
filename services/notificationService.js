const { Notification } = require('../models');

const createNotification = async ({ user_id, title, message, type = 'general', io = null }) => {
  const notification = await Notification.create({
    user_id,
    title,
    message,
    type
  });

  if (io) {
    io.to(`user_${user_id}`).emit('new-notification', notification);
  }

  return notification;
};

module.exports = {
  createNotification
};