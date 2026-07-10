const { Restaurant } = require('../models');

exports.createRestaurant = async (req, res) => {
  try {
    const {
      restaurant_name,
      description,
      address,
      city,
      pincode,
      phone
    } = req.body;

    if (!restaurant_name || !address || !city || !pincode || !phone) {
      return res.status(400).json({
        error: true,
        message: 'Restaurant name, address, city, pincode and phone are required.'
      });
    }

    const image = req.file ? `/uploads/restaurant/${req.file.filename}` : null;

const restaurant = await Restaurant.create({
  owner_id: req.user.user_id,
  restaurant_name,
  description,
  address,
  city,
  pincode,
  phone,
  image,
  status: 'approved',
  is_open: true
});
    return res.status(201).json({
      error: false,
      message: 'Restaurant created successfully.',
      data: restaurant
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Restaurant create failed.',
      data: error.message
    });
  }
};

exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { owner_id: req.user.user_id },
      order: [['restaurant_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Restaurants fetched successfully.',
      data: restaurants
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Restaurants fetch failed.',
      data: error.message
    });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        error: true,
        message: 'Restaurant not found or access denied.'
      });
    }

    const image = req.file
      ? `/uploads/restaurant/${req.file.filename}`
      : restaurant.image;

    await restaurant.update({
      restaurant_name: req.body.restaurant_name || restaurant.restaurant_name,
      description: req.body.description || restaurant.description,
      address: req.body.address || restaurant.address,
      city: req.body.city || restaurant.city,
      pincode: req.body.pincode || restaurant.pincode,
      phone: req.body.phone || restaurant.phone,
      image
    });

    return res.status(200).json({
      error: false,
      message: 'Restaurant updated successfully.',
      data: restaurant
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Restaurant update failed.',
      data: error.message
    });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        error: true,
        message: 'Restaurant not found or access denied.'
      });
    }

    await restaurant.destroy();

    return res.status(200).json({
      error: false,
      message: 'Restaurant deleted successfully.'
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Restaurant delete failed.',
      data: error.message
    });
  }
};

exports.getAllRestaurantsForCustomer = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: {
        status: 'approved',
        is_open: true
      },
      order: [['restaurant_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Restaurants fetched successfully.',
      data: restaurants
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Restaurant fetch failed.',
      data: error.message
    });
  }
};