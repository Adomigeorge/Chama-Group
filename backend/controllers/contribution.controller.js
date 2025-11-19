const { Contribution, Chama, ChamaMember, User } = require('../models');
const { generateUniqueShortId } = require('../utils/idGenerator');

// Make a contribution
const makeContribution = async (req, res) => {
  try {
    const { chamaId, amount, paymentMethod, transactionId, notes } = req.body;
    const userId = req.user.id;

    // Check if user is a member of this chama
    const membership = await ChamaMember.findOne({
      where: { userId, chamaId, isActive: true }
    });

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not an active member of this Chama',
      });
    }

    // Generate contribution ID
    const contributionId = await generateUniqueShortId(Contribution);

    // Create contribution
    const contribution = await Contribution.create({
      id: contributionId,
      userId,
      chamaId,
      amount,
      paymentMethod,
      transactionId,
      notes,
      status: 'completed',
    });

    res.status(201).json({
      status: 'success',
      message: 'Contribution made successfully',
      data: {
        contribution,
      },
    });
  } catch (error) {
    console.error('Make contribution error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while making contribution',
    });
  }
};

// Get contributions for a specific chama
const getChamaContributions = async (req, res) => {
  try {
    const { chamaId } = req.params;
    const userId = req.user.id;

    // Check if user is a member of this chama
    const membership = await ChamaMember.findOne({
      where: { userId, chamaId }
    });

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not a member of this Chama',
      });
    }

    const contributions = await Contribution.findAll({
      where: { chamaId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['contributionDate', 'DESC']],
    });

    // Calculate total contributions
    const totalContributions = contributions.reduce((sum, contrib) => {
      return sum + parseFloat(contrib.amount);
    }, 0);

    res.status(200).json({
      status: 'success',
      results: contributions.length,
      data: {
        contributions,
        summary: {
          totalContributions,
          totalMembers: contributions.filter(c => c.status === 'completed').length,
        },
      },
    });
  } catch (error) {
    console.error('Get contributions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching contributions',
    });
  }
};

// Get user's contributions across all chamas
const getMyContributions = async (req, res) => {
  try {
    const userId = req.user.id;

    const contributions = await Contribution.findAll({
      where: { userId },
      include: [
        {
          model: Chama,
          attributes: ['id', 'name', 'contributionAmount'],
        },
      ],
      order: [['contributionDate', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: contributions.length,
      data: {
        contributions,
      },
    });
  } catch (error) {
    console.error('Get my contributions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching contributions',
    });
  }
};

module.exports = {
  makeContribution,
  getChamaContributions,
  getMyContributions,
};