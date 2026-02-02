const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenWhitelist = require('../models/TokenWhitelist');
const { protect } = require('../middleware/auth');

const router = express.Router();

// generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//  token expiration date
const getTokenExpiration = () => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const match = expiresIn.match(/(\d+)([dhms])/);
  if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default 7 days
  
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  
  return new Date(Date.now() + value * multipliers[unit]);
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (only allow 'user' role on registration, admin must be set manually)
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'user' : (role || 'user') // Prevent self-admin registration
    });

    // Generate token
    const token = generateToken(user._id);
    
    // Add token to whitelist
    await TokenWhitelist.addToken(token, user._id, getTokenExpiration());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);
    
    // Add token to whitelist
    await TokenWhitelist.addToken(token, user._id, getTokenExpiration());

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

router.post('/logout', protect, async (req, res) => {
  try {
    // Remove token from whitelist
    await TokenWhitelist.removeToken(req.token);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

router.post('/logout-all', protect, async (req, res) => {
  try {
    // Remove all tokens for this user
    await TokenWhitelist.removeAllUserTokens(req.user._id);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
});

module.exports = router;
