const { group, user, members } = require('../models');

const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Fetching group details for ID:', id);
    
    const groupData = await group.findByPk(id, {
      include: [{
        model: user,
        as: 'creator',
        attributes: ['id', 'name', 'email', 'phone']
      }]
    });

    if (!groupData) {
      return res.status(404).json({
        status: 'error',
        message: 'Group not found'
      });
    }

    console.log('✅ Group found:', groupData.name);

    res.status(200).json({
      status: 'success',
      data: {
        group: groupData
      }
    });

  } catch (error) {
    console.error('💥 Get group error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching group'
    });
  }
};

// Create new group
const createGroup = async (req, res) => {
  try {
    console.log('🎯 === CREATE GROUP CONTROLLER ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.user.id);

    const {
      name,
      description,
      group_type,
      meeting_frequency,
      contribution_amount
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Group name is required'
      });
    }

    // Create group data object
    const groupData = {
      name,
      description,
      group_type: group_type || 'savings',
      meeting_frequency: meeting_frequency || 'monthly',
      contribution_amount: contribution_amount || 0,
      total_savings: 0,
      created_by: req.user.id,
      date_created: new Date()
    };

    console.log('📦 Group data being created:', groupData);

    // Create the group
    const newGroup = await group.create(groupData);
    console.log('✅ Group created successfully. Group ID:', newGroup.id);

    console.log('👥 Adding creator as member...');
    
    const creatorMember = await members.create({
      group_id: newGroup.id,
      user_id: req.user.id,
      role: 'admin',
      status: 'active',
      invited_by: req.user.id,
      joined_at: new Date()
    });
    
    console.log('🎉 SUCCESS: Creator added as member! Member ID:', creatorMember.id);

    res.status(201).json({
      status: 'success',
      message: 'Group created successfully',
      data: {
        group: newGroup
      }
    });

  } catch (error) {
    console.error('💥 Create group error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating group'
    });
  }
};

// Get user's groups
const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('🔍 Fetching groups for user ID:', userId);
    
    const userGroups = await group.findAll({
      where: { created_by: userId }
    });

    console.log('📦 Found groups:', userGroups.length);

    res.status(200).json({
      status: 'success',
      data: {
        groups: userGroups
      }
    });
  } catch (error) {
    console.error('💥 Get user groups error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching groups'
    });
  }
};

module.exports = {
  createGroup,
  getUserGroups,
  getGroupById
};