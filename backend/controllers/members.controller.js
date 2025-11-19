const { members, user, group } = require('../models');
const { sendInvitationEmail, verifyEmailConfig } = require('../services/email.service');
const { Op } = require('sequelize');

// Initialize email service on app startup
verifyEmailConfig().then(isValid => {
  if (isValid) {
    console.log('🚀 Email service is ready');
  } else {
    console.log('⚠️ Email service configuration needs attention');
  }
});

// Invite member to group
const inviteMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email, role = 'member' } = req.body;
    const invitedBy = req.user.id;

    console.log('🎯 Inviting member:', { groupId, email, role, invitedBy });

    // 1. Find the user by email
    const userToInvite = await user.findOne({ where: { email } });
    if (!userToInvite) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found with this email. Please ask them to register first.'
      });
    }

    // 2. Check if user is already a member
    const existingMember = await members.findOne({
      where: { group_id: groupId, user_id: userToInvite.id }
    });

    const groupData = await group.findByPk(groupId);
    if (!groupData) {
      return res.status(404).json({
        status: 'error',
        message: 'Group not found'
      });
    }

    if (groupData.created_by === userToInvite.id) {
      return res.status(400).json({
        status: 'error',
        message: 'User is the creator of this group'
      });
    }

    if (existingMember) {
      const message = existingMember.status === 'pending' 
        ? 'User has already been invited and is pending acceptance'
        : 'User is already a member of this group';
      
      return res.status(400).json({
        status: 'error',
        message: message
      });
    }

    // 3. Get inviter info for email
    const inviter = await user.findByPk(invitedBy);

    // 4. Create member record with pending status and expiry
    const invitationExpires = new Date();
    invitationExpires.setDate(invitationExpires.getDate() + 7);

    const member = await members.create({
      group_id: groupId,
      user_id: userToInvite.id,
      role: role,
      status: 'pending',
      invited_by: invitedBy,
      invited_at: new Date(),
      invitation_expires: invitationExpires 
    });

    console.log('✅ Member record created, expires:', invitationExpires);

    // 5. Send invitation email
    let emailSent = false;
    try {
      const invitationLink = `http://localhost:5173/groups/${groupId}/join`;
      
      console.log('📧 Sending invitation email...');
      console.log('🔗 Invitation Link:', invitationLink);
      
      await sendInvitationEmail(
        email,
        groupData.name,
        inviter.name || inviter.email,
        invitationLink,
        invitationExpires // Pass expiry date to email
      );
      
      emailSent = true;
      console.log('✅ Invitation email sent successfully');

    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError.message);
    }

    // 6. Prepare response
    const responseMessage = emailSent 
      ? 'Invitation sent successfully! The member will receive an email to join the group.'
      : 'Member invited successfully, but invitation email failed to send. You may need to send the invitation again.';

    res.status(201).json({
      status: 'success',
      message: responseMessage,
      data: {
        member: {
          id: member.id,
          user: {
            id: userToInvite.id,
            name: userToInvite.name,
            email: userToInvite.email
          },
          role: member.role,
          status: member.status,
          email_sent: emailSent,
          expires_at: invitationExpires
        }
      }
    });

  } catch (error) {
    console.error('💥 Invite member error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while inviting member'
    });
  }
};

const getGroupMembers = async (req, res) => {
  console.log('🎯 [MEMBERS] getGroupMembers called for group:', req.params.groupId);
  
  try {
    const { groupId } = req.params;
    
    console.log('🔍 [MEMBERS] Step 1: Fetching group...');
    const groupData = await group.findByPk(groupId);
    
    if (!groupData) {
      console.log('❌ [MEMBERS] Group not found');
      return res.status(404).json({
        status: 'error',
        message: 'Group not found'
      });
    }
    console.log('✅ [MEMBERS] Group found:', groupData.name);

    console.log('🔍 [MEMBERS] Step 2: Fetching members...');
    const allMembers = await members.findAll({
      where: { group_id: groupId }
    });
    console.log('✅ [MEMBERS] Members found:', allMembers.length);

    console.log('🔍 [MEMBERS] Step 3: Fetching user data...');
    const membersWithUsers = await Promise.all(
      allMembers.map(async (member) => {
        const userData = await user.findByPk(member.user_id, {
          attributes: ['id', 'name', 'email']
        });
        
        return {
          id: member.id,
          user_id: member.user_id,
          role: member.role,
          status: member.status,
          invited_by: member.invited_by,
          created_at: member.created_at,
          invitation_expires: member.invitation_expires,
          user: userData,
          is_creator: member.user_id === groupData.created_by
        };
      })
    );
    console.log('✅ [MEMBERS] User data processed');

    console.log('🔍 [MEMBERS] Step 4: Sending response...');
    res.status(200).json({
      status: 'success',
      data: {
        members: membersWithUsers,
        totalCount: membersWithUsers.length
      }
    });
    console.log('✅ [MEMBERS] Response sent successfully!');

  } catch (error) {
    console.error('[MEMBERS] Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching members'
    });
  }
};

// Accept invitation
const acceptInvitation = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    console.log('✅ Accepting invitation for user:', userId, 'group:', groupId);

    // Find the pending invitation
    const member = await members.findOne({
      where: { 
        group_id: groupId, 
        user_id: userId, 
        status: 'pending' 
      }
    });

    if (!member) {
      return res.status(404).json({
        status: 'error',
        message: 'Invitation not found. It may have expired or been cancelled.'
      });
    }

    // Check if invitation has expired
    if (member.invitation_expires && new Date() > member.invitation_expires) {
      // DELETE the expired invitation record immediately
      await members.destroy({
        where: { id: member.id }
      });

      console.log('🗑️ Expired invitation DELETED for user:', userId);

      return res.status(410).json({
        status: 'error',
        message: 'This invitation has expired. Please ask for a new invitation.'
      });
    }

    // Update to active status
    await member.update({
      status: 'active',
      joined_at: new Date()
    });

    console.log('✅ Invitation accepted successfully - member is now active');

    res.status(200).json({
      status: 'success',
      message: 'Invitation accepted successfully! You are now a member of the group.',
      data: {
        member: {
          id: member.id,
          status: member.status,
          joined_at: member.joined_at
        }
      }
    });

  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while accepting invitation'
    });
  }
};

const cleanupExpiredInvitations = async () => {
  try {
    const result = await members.destroy({
      where: {
        status: 'pending',
        invitation_expires: {
          [Op.lt]: new Date() 
        }
      }
    });

    if (result > 0) {
      console.log(`🗑️ Cleanup: Deleted ${result} expired invitations from members table`);
    }

    return result;
  } catch (error) {
    console.error('💥 Cleanup error:', error);
    return 0;
  }
};

module.exports = {
  inviteMember,
  getGroupMembers,
  acceptInvitation,
  cleanupExpiredInvitations
};