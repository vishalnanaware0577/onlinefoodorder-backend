const { Coupon, Restaurant } = require('../models');

exports.createCoupon = async (req, res) => {
  try {
    const {
      restaurant_id,
      coupon_code,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      start_date,
      end_date
    } = req.body;

    if (!restaurant_id || !coupon_code || !discount_type || !discount_value || !start_date || !end_date) {
      return res.status(400).json({
        error: true,
        message: 'Required fields missing.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Restaurant not found or access denied.'
      });
    }

    const coupon = await Coupon.create({
      restaurant_id,
      coupon_code: coupon_code.toUpperCase(),
      discount_type,
      discount_value,
      min_order_amount: min_order_amount || 0,
      max_discount_amount,
      start_date,
      end_date
    });

    return res.status(201).json({
      error: false,
      message: 'Coupon created successfully.',
      data: coupon
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Coupon create failed.',
      data: error.message
    });
  }
};

exports.getMyCoupons = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      where: { owner_id: req.user.user_id },
      attributes: ['restaurant_id']
    });

    const restaurantIds = restaurants.map(item => item.restaurant_id);

    const coupons = await Coupon.findAll({
      where: { restaurant_id: restaurantIds },
      order: [['coupon_id', 'DESC']]
    });

    return res.status(200).json({
      error: false,
      message: 'Coupons fetched successfully.',
      data: coupons
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Coupons fetch failed.',
      data: error.message
    });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    const coupon = await Coupon.findByPk(coupon_id);

    if (!coupon) {
      return res.status(404).json({
        error: true,
        message: 'Coupon not found.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: coupon.restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Access denied.'
      });
    }

    await coupon.update({
      coupon_code: req.body.coupon_code
        ? req.body.coupon_code.toUpperCase()
        : coupon.coupon_code,
      discount_type: req.body.discount_type || coupon.discount_type,
      discount_value: req.body.discount_value || coupon.discount_value,
      min_order_amount: req.body.min_order_amount || coupon.min_order_amount,
      max_discount_amount: req.body.max_discount_amount || coupon.max_discount_amount,
      start_date: req.body.start_date || coupon.start_date,
      end_date: req.body.end_date || coupon.end_date,
      status: req.body.status || coupon.status
    });

    return res.status(200).json({
      error: false,
      message: 'Coupon updated successfully.',
      data: coupon
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Coupon update failed.',
      data: error.message
    });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { coupon_id } = req.params;

    const coupon = await Coupon.findByPk(coupon_id);

    if (!coupon) {
      return res.status(404).json({
        error: true,
        message: 'Coupon not found.'
      });
    }

    const restaurant = await Restaurant.findOne({
      where: {
        restaurant_id: coupon.restaurant_id,
        owner_id: req.user.user_id
      }
    });

    if (!restaurant) {
      return res.status(403).json({
        error: true,
        message: 'Access denied.'
      });
    }

    await coupon.destroy();

    return res.status(200).json({
      error: false,
      message: 'Coupon deleted successfully.'
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Coupon delete failed.',
      data: error.message
    });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { restaurant_id, coupon_code, total_amount } = req.body;

    if (!restaurant_id || !coupon_code || !total_amount) {
      return res.status(400).json({
        error: true,
        message: 'Restaurant ID, coupon code and total amount are required.'
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    const coupon = await Coupon.findOne({
      where: {
        restaurant_id,
        coupon_code: coupon_code.toUpperCase(),
        status: 'active'
      }
    });

    if (!coupon) {
      return res.status(404).json({
        error: true,
        message: 'Invalid coupon code.'
      });
    }

    if (today < coupon.start_date || today > coupon.end_date) {
      return res.status(400).json({
        error: true,
        message: 'Coupon expired or not started.'
      });
    }

    if (Number(total_amount) < Number(coupon.min_order_amount)) {
      return res.status(400).json({
        error: true,
        message: `Minimum order amount should be ₹${coupon.min_order_amount}.`
      });
    }

    let discountAmount = 0;

    if (coupon.discount_type === 'percentage') {
      discountAmount = (Number(total_amount) * Number(coupon.discount_value)) / 100;

      if (coupon.max_discount_amount && discountAmount > Number(coupon.max_discount_amount)) {
        discountAmount = Number(coupon.max_discount_amount);
      }
    }

    if (coupon.discount_type === 'fixed') {
      discountAmount = Number(coupon.discount_value);
    }

    const finalAmount = Number(total_amount) - discountAmount;

    return res.status(200).json({
      error: false,
      message: 'Coupon applied successfully.',
      data: {
        coupon_id: coupon.coupon_id,
        coupon_code: coupon.coupon_code,
        total_amount: Number(total_amount),
        discount_amount: discountAmount,
        final_amount: finalAmount
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Coupon apply failed.',
      data: error.message
    });
  }
};