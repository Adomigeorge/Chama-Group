const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware'); 

// Public routes
router.post('/register', registerUser);

// Protected routes (require authentication)
router.get('/profile', protect, (req, res) => {
  // req.user is available from the protect middleware
  const userResponse = { ...req.user.toJSON() };
  delete userResponse.password;

  res.status(200).json({
    status: 'success',
    message: 'Profile retrieved successfully',
    data: {
      user: userResponse,
    },
  });
});

// Get current user
router.get('/me', protect, (req, res) => {
  const userResponse = { ...req.user.toJSON() };
  delete userResponse.password;

  res.status(200).json({
    status: 'success',
    data: {
      user: userResponse,
    },
  });
});

module.exports = router;