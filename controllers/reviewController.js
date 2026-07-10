const { Review, Order, Restaurant, User } = require('../models');

exports.addReview = async (req, res) => {
  try {
    const { order_id, rating, comment } = req.body;

    if (!order_id || !rating) {
      return res.status(400).json({
        error: true,
        message: 'Order ID and rating are required.'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: true,
        message: 'Rating must be between 1 and 5.'
      });
    }

    const order = await Order.findOne({
      where: {
        order_id,
        customer_id: req.user.user_id,
        order_status: 'delivered'
      }
    });

    if (!order) {
      return res.status(404).json({
        error: true,
        message: 'Delivered order not found.'
      });
    }

    const existingReview = await Review.findOne({
      where: {
        order_id,
        customer_id: req.user.user_id
      }
    });

    if (existingReview) {
      return res.status(409).json({
        error: true,
        message: 'Review already submitted for this order.'
      });
    }

    const review = await Review.create({
      customer_id: req.user.user_id,
      restaurant_id: order.restaurant_id,
      order_id,
      rating,
      comment
    });

    return res.status(201).json({
      error: false,
      message: 'Review submitted successfully.',
      data: review
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Review submit failed.',
      data: error.message
    });
  }
};

exports.getRestaurantReviews = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const reviews = await Review.findAll({
      where: { restaurant_id },
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['user_id', 'name']
        }
      ],
      order: [['review_id', 'DESC']]
    });

    let averageRating = 0;

    if (reviews.length > 0) {
      const total = reviews.reduce((sum, item) => {
        return sum + Number(item.rating);
      }, 0);

      averageRating = (total / reviews.length).toFixed(1);
    }

    return res.status(200).json({
      error: false,
      message: 'Reviews fetched successfully.',
      data: {
        averageRating,
        totalReviews: reviews.length,
        reviews
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Reviews fetch failed.',
      data: error.message
    });
  }
};

exports.getMyRestaurantReviews = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { owner_id: req.user.user_id },
      attributes: ['restaurant_id']
    });

    const restaurantIds = restaurants.map(item => item.restaurant_id);

    const reviews = await Review.findAll({
      where: { restaurant_id: restaurantIds },
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['user_id', 'name']
        },
        {
          model: Restaurant,
          as: 'restaurant'
        }
      ],
      order: [['review_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'My restaurant reviews fetched successfully.',
      data: reviews
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'My restaurant reviews fetch failed.',
      data: error.message
    });
  }
};