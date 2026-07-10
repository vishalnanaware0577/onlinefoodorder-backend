const transporter = require('../config/email');

const sendWelcomeEmail = async (user) => {
  let message = '';

  if (user.role === 'customer') {
    message = 'Welcome! You can now browse restaurants and order your favorite food.';
  }

  if (user.role === 'hotel_owner') {
    message = 'Welcome Hotel Owner! You can now add your hotel, upload documents, and manage dishes.';
  }

  if (user.role === 'delivery_partner') {
    message = 'Welcome Delivery Partner! You can now accept food delivery orders.';
  }

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Welcome to Online Food Ordering System',
    html: `
      <h2>Hello ${user.name},</h2>
      <p>${message}</p>
      <p>Thank you for joining our food ordering platform.</p>
    `
  });
};

module.exports = {
  sendWelcomeEmail
};