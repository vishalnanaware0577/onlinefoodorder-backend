const { Wishlist, FoodItem } = require('../models');

exports.toggleWishlist = async (req, res) => {
  try {
    const { food_id } = req.body;

    if (!food_id) {
      return res.status(400).json({
        error: true,
        message: 'Food ID is required.'
      });
    }

    const food = await FoodItem.findByPk(food_id);

    if (!food) {
      return res.status(404).json({
        error: true,
        message: 'Food item not found.'
      });
    }

    const existing = await Wishlist.findOne({
      where: {
        customer_id: req.user.user_id,
        food_id
      }
    });

    if (existing) {
      await existing.destroy();

      return res.status(200).json({
        error: false,
        message: 'Removed from wishlist.',
        isWishlisted: false
      });
    }

    await Wishlist.create({
      customer_id: req.user.user_id,
      food_id
    });

    return res.status(201).json({
      error: false,
      message: 'Added to wishlist.',
      isWishlisted: true
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Wishlist update failed.',
      data: error.message
    });
  }
};

exports.getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { customer_id: req.user.user_id },
      include: [
        {
          model: FoodItem,
          as: 'food'
        }
      ],
      order: [['wishlist_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Wishlist fetched successfully.',
      data: wishlist
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Wishlist fetch failed.',
      data: error.message
    });
  }
};