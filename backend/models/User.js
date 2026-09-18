const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbconfig');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'English',
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Technology',
    },
    voice: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Aria',
    },
    resetOtp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetOtpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
