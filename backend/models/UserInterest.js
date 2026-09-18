const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const UserInterest = sequelize.define(
  'UserInterest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    interest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'user_interests',
    timestamps: true,
  }
);

module.exports = UserInterest;
