const jwt = require('jsonwebtoken');
const { user } = require('../models');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentuser = await user.findByPk(decoded.userId);
    if (!currentuser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 4) Check if user changed password after token was issued
    // (We'll implement this later when we add passwordChangedAt field)

    // 5) Grant access to protected route
    req.user = currentuser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired! Please log in again.',
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong with authentication',
    });
  }
};

// Optional: Restrict to certain roles (for future use)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};