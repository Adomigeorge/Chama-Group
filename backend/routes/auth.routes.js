const express = require('express');
const { loginUser } = require('../controllers/auth.controller');

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;