const {
  Cart,
  CartItem,
  FoodItem,
  Restaurant,
  Order,
  OrderItem
} = require('../models');

const { createNotification } = require('../services/notificationService');

exports.placeOrder = async (req, res) => {
  try {
    const { delivery_address, payment_method } = req.body;

    if (!delivery_address) {
      return res.status(400).json({
        error: true,
        message: 'Delivery address is required.'
      });
    }

    const cart = await Cart.findOne({
      where: { customer_id: req.user.user_id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [{ model: FoodItem, as: 'food' }]
        }
      ]
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Cart is empty.'
      });
    }

    const firstRestaurantId = cart.items[0].food.restaurant_id;

    const differentRestaurantItem = cart.items.find(
      item => item.food.restaurant_id !== firstRestaurantId
    );

    if (differentRestaurantItem) {
      return res.status(400).json({
        error: true,
        message: 'You can order food from only one restaurant at a time.'
      });
    }

    let totalAmount = 0;

    cart.items.forEach(item => {
      totalAmount += Number(item.price) * Number(item.quantity);
    });

    const order = await Order.create({
      customer_id: req.user.user_id,
      restaurant_id: firstRestaurantId,
      total_amount: totalAmount,
      delivery_address,
      payment_method: payment_method || 'cod',
      payment_status: 'pending',
      order_status: 'placed'
    });

    for (const item of cart.items) {
      await OrderItem.create({
        order_id: order.order_id,
        food_id: item.food_id,
        food_name: item.food.food_name,
        quantity: item.quantity,
        price: item.price
      });
    }

    await CartItem.destroy({
      where: { cart_id: cart.cart_id }
    });

    const io = req.app.get('io');
    const restaurant = await Restaurant.findByPk(firstRestaurantId);

    if (io) {
      io.emit('new-order', {
        order_id: order.order_id,
        restaurant_id: order.restaurant_id,
        message: 'New order placed.'
      });
    }

    await createNotification({
      user_id: req.user.user_id,
      title: 'Order Placed',
      message: `Your order #${order.order_id} has been placed successfully.`,
      type: 'order',
      io
    });

    if (restaurant) {
      await createNotification({
        user_id: restaurant.owner_id,
        title: 'New Order Received',
        message: `New order #${order.order_id} received.`,
        type: 'order',
        io
      });
    }

    return res.status(201).json({
      error: false,
      message: 'Order placed successfully.',
      data: order
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Order place failed.',
      data: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customer_id: req.user.user_id },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Restaurant, as: 'restaurant' }
      ],
      order: [['order_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'My orders fetched successfully.',
      data: orders
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Orders fetch failed.',
      data: error.message
    });
  }
};

exports.getHotelOrders = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { owner_id: req.user.user_id },
      attributes: ['restaurant_id']
    });

    const restaurantIds = restaurants.map(item => item.restaurant_id);

    const orders = await Order.findAll({
      where: { restaurant_id: restaurantIds },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Restaurant, as: 'restaurant' }
      ],
      order: [['order_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Hotel orders fetched successfully.',
      data: orders
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Hotel orders fetch failed.',
      data: error.message
    });
  }
};

exports.updateHotelOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { order_status } = req.body;

    const allowedStatus = ['accepted', 'preparing', 'ready', 'cancelled'];

    if (!allowedStatus.includes(order_status)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid hotel order status.'
      });
    }

    const order = await Order.findByPk(order_id);

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Order not found.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: order.restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Access denied.'
      });
    }

    order.order_status = order_status;
    await order.save();

    const io = req.app.get('io');

    await createNotification({
      user_id: order.customer_id,
      title: 'Order Status Updated',
      message: `Your order #${order.order_id} status is now ${order.order_status}.`,
      type: 'order',
      io
    });

    if (io) {
      io.to(`order_${order.order_id}`).emit('order-status-updated', {
        order_id: order.order_id,
        order_status: order.order_status,
        message: `Order status updated to ${order.order_status}`
      });

      if (order.order_status === 'ready') {
        io.emit('new-delivery-order', {
          order_id: order.order_id,
          restaurant_id: order.restaurant_id,
          message: 'New delivery order available'
        });
      }
    }

    return res.status(200).json({
      error: false,
      message: 'Order status updated successfully.',
      data: order
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Order status update failed.',
      data: error.message
    });
  }
};

exports.getAvailableDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        order_status: 'ready',
        delivery_partner_id: null
      },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Restaurant, as: 'restaurant' }
      ],
      order: [['order_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Available delivery orders fetched successfully.',
      data: orders
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Available orders fetch failed.',
      data: error.message
    });
  }
};

exports.acceptDeliveryOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findOne({
      where: {
        order_id,
        order_status: 'ready',
        delivery_partner_id: null
      }
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Order not available.'
      });
    }

    order.delivery_partner_id = req.user.user_id;
    order.order_status = 'picked_up';
    await order.save();

    const io = req.app.get('io');

    await createNotification({
      user_id: order.customer_id,
      title: 'Delivery Partner Assigned',
      message: `Delivery partner accepted your order #${order.order_id}.`,
      type: 'delivery',
      io
    });

    if (io) {
      io.to(`order_${order.order_id}`).emit('order-status-updated', {
        order_id: order.order_id,
        order_status: order.order_status,
        message: 'Delivery partner picked up your order.'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Delivery order accepted successfully.',
      data: order
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Delivery accept failed.',
      data: error.message
    });
  }
};

exports.getMyDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { delivery_partner_id: req.user.user_id },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Restaurant, as: 'restaurant' }
      ],
      order: [['order_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'My delivery orders fetched successfully.',
      data: orders
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Delivery orders fetch failed.',
      data: error.message
    });
  }
};

exports.markDelivered = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findOne({
      where: {
        order_id,
        delivery_partner_id: req.user.user_id
      }
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Order not found or access denied.'
      });
    }

    order.order_status = 'delivered';

    if (order.payment_method === 'cod') {
      order.payment_status = 'paid';
    }

    await order.save();

    const io = req.app.get('io');

    await createNotification({
      user_id: order.customer_id,
      title: 'Order Delivered',
      message: `Your order #${order.order_id} has been delivered successfully.`,
      type: 'delivery',
      io
    });

    if (io) {
      io.to(`order_${order.order_id}`).emit('order-status-updated', {
        order_id: order.order_id,
        order_status: order.order_status,
        message: 'Order delivered successfully.'
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Order delivered successfully.',
      data: order
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Delivered update failed.',
      data: error.message
    });
  }
};
exports.cancelMyOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

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

    if (!['placed', 'accepted'].includes(order.order_status)) {
      return res.status(400).json({
        error: true,
        message: 'You can cancel only placed or accepted orders.'
      });
    }

    order.order_status = 'cancelled';
    await order.save();

    const io = req.app.get('io');

    if (io) {
      io.to(`order_${order.order_id}`).emit('order-status-updated', {
        order_id: order.order_id,
        order_status: order.order_status,
        message: 'Order cancelled by customer.'
      });
    }

    await createNotification({
      user_id: order.customer_id,
      title: 'Order Cancelled',
      message: `Your order #${order.order_id} has been cancelled.`,
      type: 'order',
      io
    });

    return res.status(200).json({
      error: false,
      message: 'Order cancelled successfully.',
      data: order
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Order cancel failed.',
      data: error.message
    });
  }
};