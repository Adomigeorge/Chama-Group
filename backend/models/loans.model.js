const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loan = sequelize.define('Loan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  chamaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Chamas',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'disbursed', 'completed'),
    defaultValue: 'pending',
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00,
  },
  repaymentPeriod: {
    type: DataTypes.INTEGER, // in months
    defaultValue: 12,
  },
  appliedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  approvedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  disbursedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  indexes: [
    {
      fields: ['userId', 'chamaId']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Loan;