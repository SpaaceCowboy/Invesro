const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenWhitelist = require('../models/TokenWhitelist');

// Protect routes 
const protect = async (req, res, next) => {
  try {
    let token;

  
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Check if token is whitelisted
    const isWhitelisted = await TokenWhitelist.isWhitelisted(token);
    if (!isWhitelisted) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid or has been revoked'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

// Role-based access 
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
