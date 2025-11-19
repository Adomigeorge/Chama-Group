const { Loan, LoanApplication, Chama, ChamaMember, User, Contribution } = require('../models');
const { generateUniqueShortId } = require('../utils/idGenerator');

// Apply for a loan
const applyForLoan = async (req, res) => {
  try {
    const { chamaId, amount, purpose, repaymentPeriod } = req.body;
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

    // Check chama's available funds (sum of all contributions)
    const totalContributions = await Contribution.sum('amount', {
      where: { chamaId, status: 'completed' }
    });

    if (amount > totalContributions * 0.5) { // Max 50% of total funds
      return res.status(400).json({
        status: 'error',
        message: 'Loan amount exceeds maximum allowed (50% of chama funds)',
      });
    }

    // Generate loan ID
    const loanId = await generateUniqueShortId(Loan);

    // Create loan application
    const loan = await Loan.create({
      id: loanId,
      userId,
      chamaId,
      amount,
      purpose,
      repaymentPeriod: repaymentPeriod || 12,
      status: 'pending',
    });

    res.status(201).json({
      status: 'success',
      message: 'Loan application submitted successfully',
      data: {
        loan,
      },
    });
  } catch (error) {
    console.error('Apply for loan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while applying for loan',
    });
  }
};

// Vote on a loan application
const voteOnLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { vote, comments } = req.body;
    const userId = req.user.id;

    // Check if loan exists
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan application not found',
      });
    }

    // Check if user is a member of the same chama
    const membership = await ChamaMember.findOne({
      where: { userId, chamaId: loan.chamaId, isActive: true }
    });

    if (!membership) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not a member of this Chama',
      });
    }

    // Check if user has already voted
    const existingVote = await LoanApplication.findOne({
      where: { loanId, userId }
    });

    if (existingVote) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already voted on this loan application',
      });
    }

    // Generate loan application ID
    const loanAppId = await generateUniqueShortId(LoanApplication);

    // Record vote
    await LoanApplication.create({
      id: loanAppId,
      loanId,
      userId,
      vote,
      comments,
    });

    res.status(200).json({
      status: 'success',
      message: 'Vote recorded successfully',
      data: {
        vote: { vote, comments },
      },
    });
  } catch (error) {
    console.error('Vote on loan error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while voting on loan',
    });
  }
};

// Get pending loans for a chama (for voting)
const getPendingLoans = async (req, res) => {
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

    const pendingLoans = await Loan.findAll({
      where: { chamaId, status: 'pending' },
      include: [
        {
          model: User,
          as: 'borrower',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: LoanApplication,
          as: 'votes',
          include: [{
            model: User,
            as: 'voter',
            attributes: ['firstName', 'lastName'],
          }],
        },
      ],
      order: [['appliedDate', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: pendingLoans.length,
      data: {
        loans: pendingLoans,
      },
    });
  } catch (error) {
    console.error('Get pending loans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching pending loans',
    });
  }
};

// Get user's loan history
const getMyLoans = async (req, res) => {
  try {
    const userId = req.user.id;

    const loans = await Loan.findAll({
      where: { userId },
      include: [
        {
          model: Chama,
          attributes: ['id', 'name'],
        },
      ],
      order: [['appliedDate', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: loans.length,
      data: {
        loans,
      },
    });
  } catch (error) {
    console.error('Get my loans error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching loans',
    });
  }
};

module.exports = {
  applyForLoan,
  voteOnLoan,
  getPendingLoans,
  getMyLoans,
};