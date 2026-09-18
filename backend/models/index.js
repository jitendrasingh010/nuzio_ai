const sequelize = require('../config/dbconfig');
const User = require('./User');
const News = require('./News');
const UserInterest = require('./UserInterest');

// Relationships
User.hasMany(UserInterest, {
  foreignKey: 'userId',
  as: 'interests',
  onDelete: 'CASCADE',
});

UserInterest.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

module.exports = {
  sequelize,
  User,
  News,
  UserInterest,
};
