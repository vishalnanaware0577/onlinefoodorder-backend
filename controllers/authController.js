const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendWelcomeEmail } = require('../services/emailService');

// ==========================
// Generate JWT Token
// ==========================
const generateToken = (user) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// ==========================
// Register User
// ==========================
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Validation
    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({
        error: true,
        message: 'All fields are required.'
      });
    }

    // Role Validation
    if (!['customer', 'hotel_owner', 'delivery_partner'].includes(role)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid role selected.'
      });
    }

    // Check Existing Email
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: 'Email already registered.'
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
      role
    });

    // Generate Token
    const token = generateToken(user);

    // Send Response Immediately
    res.status(201).json({
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

    // Send Welcome Email in Background
    sendWelcomeEmail(user)
      .then(() => {
        console.log(`✅ Welcome email sent to ${user.email}`);
      })
      .catch((err) => {
        console.log('❌ Email Error:', err.message);
      });

  } catch (error) {
    console.log('REGISTER ERROR:', error);

    return res.status(500).json({
      error: true,
      message: 'Registration failed.'
    });
  }
};

// ==========================
// Login User
// ==========================
exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required.'
      });
    }

    // Find User
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found.'
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: true,
        message: 'Invalid password.'
      });
    }

    // Generate Token
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

    console.log('LOGIN ERROR:', error);

    return res.status(500).json({
      error: true,
      message: 'Login failed.'
    });

  }
};