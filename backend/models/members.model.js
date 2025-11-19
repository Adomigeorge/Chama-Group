const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    allowNull: false,
    defaultValue: 'member'
  },
  status: {
    type: DataTypes.ENUM('active', 'pending', 'rejected'),
    allowNull: false,
    defaultValue: 'pending'
  },
  invited_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  joined_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  total_contributions: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  left_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
  
}, {
  tableName: 'members',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['group_id', 'user_id']
    }
  ]
});

module.exports = Member;