const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const { Order } = require('../models');

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        error: true,
        message: 'Order ID is required.'
      });
    }

    const order = await Order.findOne({
      where: {
        order_id,
        customer_id: req.user.user_id
      }
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Order not found.'
      });
    }

    const amountInPaise = Number(order.total_amount) * 100;

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_rcpt_${order.order_id}`
    });

    return res.status(200).json({
      error: false,
      message: 'Razorpay order created successfully.',
      data: {
        razorpay_order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        app_order_id: order.order_id
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Razorpay order create failed.',
      data: error.message
    });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!order_id || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: true,
        message: 'All payment fields are required.'
      });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        error: true,
        message: 'Payment verification failed.'
      });
    }

    const order = await Order.findOne({
      where: {
        order_id,
        customer_id: req.user.user_id
      }
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Order not found.'
      });
    }

    order.payment_method = 'razorpay';
    order.payment_status = 'paid';

    await order.save();

    return res.status(200).json({
      error: false,
      message: 'Payment verified successfully.',
      data: order
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Payment verification failed.',
      data: error.message
    });
  }
};