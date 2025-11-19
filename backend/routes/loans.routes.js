const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, (req, res) => {
  res.status(201).json({
    status: 'success', 
    message: 'Loan application submitted'
  });
});

module.exports = router;