const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createGroup, getUserGroups, getGroupById } = require('../controllers/groups.controller');

//Get user's groups
router.get('/', protect, getUserGroups);

//Create new group
router.post('/', protect, createGroup);

//Get single group
router.get('/:id', protect, getGroupById);

// TEMPORARY TEST ROUTE
router.get('/:id/members-test', protect, async (req, res) => {
  try {
    console.log('🧪 TEST: Starting members test route');
    
    const { id } = req.params;
    console.log('🧪 TEST: Group ID:', id);

    // Test 1: Basic response
    console.log('🧪 TEST: Sending immediate response');
    res.json({
      status: 'success',
      data: {
        members: [],
        totalCount: 0,
        message: 'Test route working'
      }
    });
    console.log('🧪 TEST: Response sent successfully');
    
  } catch (error) {
    console.error('🧪 TEST: Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;