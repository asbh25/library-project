const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Paper = sequelize.define('Paper', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authors: {
    type: DataTypes.JSON, // Store authors as JSON array
    allowNull: false,
  },
});

module.exports = Paper;
