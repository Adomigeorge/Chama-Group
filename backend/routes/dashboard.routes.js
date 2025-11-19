const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', protect, dashboardController.getDashboardStats);

module.exports = router;