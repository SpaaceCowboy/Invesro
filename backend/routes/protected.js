const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

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
