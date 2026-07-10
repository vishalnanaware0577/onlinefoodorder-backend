const { Cart, CartItem, FoodItem } = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const { food_id, quantity } = req.body;

    if (!food_id) {
      return res.status(400).json({
        error: true,
        message: 'Food ID is required.'
      });
    }

    const food = await FoodItem.findByPk(food_id);

    if (!food || !food.is_available) {
      return res.status(404).json({
        error: true,
        message: 'Food item not found or unavailable.'
      });
    }

    let cart = await Cart.findOne({
      where: { customer_id: req.user.user_id }
    });

    if (!cart) {
      cart = await Cart.create({
        customer_id: req.user.user_id
      });
    }

    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.cart_id,
        food_id
      }
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity || 1);
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart_id: cart.cart_id,
        food_id,
        quantity: quantity || 1,
        price: food.price
      });
    }

    return res.status(200).json({
      error: false,
      message: 'Food added to cart successfully.',
      data: cartItem
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Add to cart failed.',
      data: error.message
    });
  }
};

exports.getMyCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { customer_id: req.user.user_id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: FoodItem,
              as: 'food'
            }
          ]
        }
      ]
    });

    if (!cart) {
      return res.status(200).json({
        error: false,
        message: 'Cart is empty.',
        data: {
          items: [],
          totalAmount: 0
        }
      });
    }

    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += Number(item.price) * Number(item.quantity);
    });

    return res.status(200).json({
      error: false,
      message: 'Cart fetched successfully.',
      data: {
        cart,
        totalAmount
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Cart fetch failed.',
      data: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        error: true,
        message: 'Quantity must be at least 1.'
      });
    }

    const cart = await Cart.findOne({
      where: { customer_id: req.user.user_id }
    });

    if (!cart) {
      return res.status(404).json({
        error: true,
        message: 'Cart not found.'
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cart_item_id,
        cart_id: cart.cart_id
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: true,
        message: 'Cart item not found.'
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({
      error: false,
      message: 'Cart item updated successfully.',
      data: cartItem
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Cart update failed.',
      data: error.message
    });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { cart_item_id } = req.params;

    const cart = await Cart.findOne({
      where: { customer_id: req.user.user_id }
    });

    if (!cart) {
      return res.status(404).json({
        error: true,
        message: 'Cart not found.'
      });
    }

    const cartItem = await CartItem.findOne({
      where: {
        cart_item_id,
        cart_id: cart.cart_id
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: true,
        message: 'Cart item not found.'
      });
    }

    await cartItem.destroy();

    return res.status(200).json({
      error: false,
      message: 'Cart item removed successfully.'
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Cart item remove failed.',
      data: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { customer_id: req.user.user_id }
    });

    if (!cart) {
      return res.status(404).json({
        error: true,
        message: 'Cart not found.'
      });
    }

    await CartItem.destroy({
      where: { cart_id: cart.cart_id }
    });

    return res.status(200).json({
      error: false,
      message: 'Cart cleared successfully.'
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Cart clear failed.',
      data: error.message
    });
  }
};