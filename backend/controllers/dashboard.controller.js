const { group, members, user, contribution } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log('📊 Fetching dashboard stats for user:', userId);

    // 1. Get user's groups count (already working)
    const userGroups = await group.findAll({
      where: { created_by: userId }
    });

    // 2. Calculate total members across all user's groups
    const totalMembers = await members.count({
      include: [{
        model: group,
        where: { created_by: userId },
        attributes: []
      }],
      where: { status: 'active' }
    });

    // 3. Calculate total savings (sum of contributions)
    const savingsData = await contribution.findOne({
      attributes: [
        [contribution.sequelize.fn('SUM', contribution.sequelize.col('amount')), 'total_savings']
      ],
      include: [{
        model: group,
        where: { created_by: userId },
        attributes: []
      }],
      raw: true
    });

    // 4. Calculate pending actions (pending invites + pending contributions, etc.)
    const pendingInvites = await members.count({
      include: [{
        model: group,
        where: { created_by: userId },
        attributes: []
      }],
      where: { status: 'pending' }
    });

    const totalSavings = savingsData?.total_savings || 0;
    const pendingActions = pendingInvites;

    console.log('📈 Stats calculated:', {
      totalSavings,
      activeGroups: userGroups.length,
      totalMembers,
      pendingActions
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalSavings,
        activeGroups: userGroups.length,
        totalMembers,
        pendingActions
      }
    });

  } catch (error) {
    console.error('💥 Get dashboard stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching dashboard stats'
    });
  }
};

module.exports = {
  getDashboardStats
};