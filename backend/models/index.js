const sequelize = require('../config/database');
const user = require('./user.model');
const group = require('./groups.model');
const members = require('./members.model');
const contribution = require('./contribution.model');
const loan = require('./loans.model'); 
const loan_repayment = require('./loan_repayment.model'); 

// Define associations
user.hasMany(group, { foreignKey: 'created_by', as: 'createdGroups' });
group.belongsTo(user, { foreignKey: 'created_by', as: 'creator' });

// Many-to-Many relationship between Users and Groups through Members
user.belongsToMany(group, { 
  through: members, 
  foreignKey: 'user_id', 
  as: 'groups' 
});
group.belongsToMany(user, { 
  through: members, 
  foreignKey: 'group_id', 
  as: 'members' 
});

// Members associations
members.belongsTo(user, { foreignKey: 'user_id' });
members.belongsTo(group, { foreignKey: 'group_id' });

// Contribution associations
contribution.belongsTo(user, { foreignKey: 'user_id' });
contribution.belongsTo(group, { foreignKey: 'group_id' });
user.hasMany(contribution, { foreignKey: 'user_id' });
group.hasMany(contribution, { foreignKey: 'group_id' });

// Loan associations
loan.belongsTo(user, { foreignKey: 'user_id', as: 'borrower' });
loan.belongsTo(group, { foreignKey: 'group_id' });
loan.belongsTo(user, { foreignKey: 'approved_by', as: 'approver' });
user.hasMany(loan, { foreignKey: 'user_id' });
group.hasMany(loan, { foreignKey: 'group_id' });

// loan_repayment associations
loan_repayment.belongsTo(loan, { foreignKey: 'loan_id' });
loan_repayment.belongsTo(user, { foreignKey: 'user_id', as: 'voter' });
loan.hasMany(loan_repayment, { foreignKey: 'loan_id', as: 'votes' });

const models = {
  user,
  group,
  members,
  contribution,
  loan,
  loan_repayment, 
};

module.exports = {
  sequelize,
  ...models,
};