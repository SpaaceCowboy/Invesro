const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/protected/user
// @desc    Route accessible by all authenticated users
// @access  Private (all roles)
router.get('/user', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome! You have user access.',
    data: {
      role: req.user.role,
      accessLevel: 'user'
    }
  });
});

// @route   GET /api/protected/moderator
// @desc    Route accessible by moderators and admins
// @access  Private (moderator, admin)
router.get('/moderator', protect, authorize('moderator', 'admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome! You have moderator access.',
    data: {
      role: req.user.role,
      accessLevel: 'moderator'
    }
  });
});

// @route   GET /api/protected/admin
// @desc    Route accessible only by admins
// @access  Private (admin only)
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome! You have admin access.',
    data: {
      role: req.user.role,
      accessLevel: 'admin'
    }
  });
});

module.exports = router;
