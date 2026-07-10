const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendWelcomeEmail } = require('../services/emailService');

const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({
        error: true,
        message: 'All fields are required.'
      });
    }

    if (!['customer', 'hotel_owner', 'delivery_partner'].includes(role)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid role selected.'
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'Email already registered.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role
    });

    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.log('Email send failed:', emailError.message);
    }

    const token = generateToken(user);

    return res.status(201).json({
      error: false,
      message: 'Registration successful.',
      token,
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Registration failed.',
      data: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required.'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: 'Invalid password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      error: false,
      message: 'Login successful.',
      token,
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Login failed.',
      data: error.message
    });
  }
};