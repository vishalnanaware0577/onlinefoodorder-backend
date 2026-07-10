const { Restaurant, FoodItem } = require('../models');

exports.createFoodItem = async (req, res) => {
  try {
    const { restaurant_id, food_name, description, price, food_type } = req.body;

    if (!restaurant_id || !food_name || !price || !food_type) {
      return res.status(400).json({
        error: true,
        message: 'Restaurant ID, food name, price and food type are required.'
      });
    }

    if (!['veg', 'non_veg'].includes(food_type)) {
      return res.status(400).json({
        error: true,
        message: 'Food type must be veg or non_veg.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        error: true,
        message: 'Restaurant not found or access denied.'
      });
    }

    const image = req.file ? `/uploads/food/${req.file.filename}` : null;

    const food = await FoodItem.create({
      restaurant_id,
      food_name,
      description,
      price,
      food_type,
      image
    });

    return res.status(201).json({
      error: false,
      message: 'Food item added successfully.',
      data: food
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Food item create failed.',
      data: error.message
    });
  }
};

exports.getFoodByRestaurant = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const foodItems = await FoodItem.findAll({
      where: {
        restaurant_id,
        is_available: true
      },
      order: [['food_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Food items fetched successfully.',
      data: foodItems
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Food items fetch failed.',
      data: error.message
    });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await FoodItem.findByPk(id);

    if (!food) {
      return res.status(404).json({
        error: true,
        message: 'Food item not found.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: food.restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Access denied.'
      });
    }

    const image = req.file ? `/uploads/food/${req.file.filename}` : food.image;

    await food.update({
      food_name: req.body.food_name || food.food_name,
      description: req.body.description || food.description,
      price: req.body.price || food.price,
      food_type: req.body.food_type || food.food_type,
      image
    });

    return res.status(200).json({
      error: false,
      message: 'Food item updated successfully.',
      data: food
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Food item update failed.',
      data: error.message
    });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await FoodItem.findByPk(id);

    if (!food) {
      return res.status(404).json({
        error: true,
        message: 'Food item not found.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: food.restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Access denied.'
      });
    }

    await food.destroy();

    return res.status(200).json({
      error: false,
      message: 'Food item deleted successfully.'
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Food item delete failed.',
      data: error.message
    });
  }
};

exports.toggleFoodAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await FoodItem.findByPk(id);

    if (!food) {
      return res.status(404).json({
        error: true,
        message: 'Food item not found.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: food.restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Access denied.'
      });
    }

    food.is_available = !food.is_available;
    await food.save();

    return res.status(200).json({
      error: false,
      message: 'Food availability updated successfully.',
      data: food
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Availability update failed.',
      data: error.message
    });
  }
};