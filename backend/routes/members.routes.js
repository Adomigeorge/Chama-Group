const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const membersController = require('../controllers/members.controller');

// POST /api/groups/:groupId/members - Invite member
router.post('/:groupId/members', protect, membersController.inviteMember);

// GET /api/groups/:groupId/members - Get group members  
router.get('/:groupId/members', protect, membersController.getGroupMembers);

// POST /api/groups/:groupId/accept - Accept invitation
router.post('/:groupId/accept', protect, membersController.acceptInvitation);

module.exports = router;