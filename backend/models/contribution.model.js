const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contribution = sequelize.define('Contribution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  chamaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'group_id',
    references: {
      model: 'groups',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  contributionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'contribution_date',
  },
  paymentMethod: {
    type: DataTypes.ENUM('mpesa', 'cash', 'bank_transfer', 'mobile_wallet'),
    defaultValue: 'mpesa',
    field: 'payment_method',
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    field: 'transaction_id',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'contributions',
  underscored: true,
  indexes: [
    {
      fields: ['user_id', 'group_id']
    },
    {
      fields: ['contribution_date']
    }
  ]
});

module.exports = Contribution;