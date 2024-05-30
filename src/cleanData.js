// src/cleanData.js
const sequelize = require("./db");
const Paper = require("./models/paper");

const cleanData = async () => {
  try {
    await sequelize.sync();

    // Отримати всі записи з таблиці Paper
    const papers = await Paper.findAll();

    for (let paper of papers) {
      // Очистити поле "abstract"
      paper.abstract = paper.abstract.replace(/\n/g, " ").trim();
      // Зберегти оновлений запис
      await paper.save();
    }

    console.log("Дані успішно очищені.");
  } catch (error) {
    console.error("Помилка під час очищення даних:", error);
  } finally {
    await sequelize.close();
  }
};

cleanData();
