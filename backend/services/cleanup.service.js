const { members } = require('../models');
const { Op } = require('sequelize');

// Function to delete expired invitations
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
      console.log(`🗑️ Deleted ${result} expired invitations from members table`);
    } else {
      console.log('✅ No expired invitations to delete');
    }

    return result;
  } catch (error) {
    console.error('💥 Error deleting expired invitations:', error);
    return 0;
  }
};

const startCleanupScheduler = () => {
  console.log('🕐 Starting expired invitations cleanup scheduler...');
 
  setTimeout(() => {
    cleanupExpiredInvitations();
  }, 5000);
  setInterval(cleanupExpiredInvitations, 60 * 60 * 1000);
  
  console.log('✅ Cleanup scheduler started (deletes expired records every hour)');
};

module.exports = {
  cleanupExpiredInvitations,
  startCleanupScheduler
};