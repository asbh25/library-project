// src/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: __dirname + "/../data/library.db", // Corrected path to your SQLite file
});

module.exports = sequelize;
