const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const loan_repayment = sequelize.define('loan_repayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  },
  loanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Loans',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  vote: {
    type: DataTypes.ENUM('approve', 'reject', 'abstain'),
    allowNull: true,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  votedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['loanId', 'userId']
    }
  ]
});

module.exports = loan_repayment;