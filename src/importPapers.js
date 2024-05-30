const csv = require('csv-parser');
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const sequelize = require('./db');
const Paper = require('./models/paper');

const importPapers = async () => {
  const papers = [];
  fs.createReadStream(__dirname + '/../data/test.csv')
    .pipe(csv())
    .on('data', (row) => {
      if (papers.length < 1000) {
        const authors = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => faker.person.fullName());
        const paper = {
          title: row.TITLE,
          abstract: row.ABSTRACT,
          authors: authors,
        };
        papers.push(paper);
      }
    })
    .on('end', async () => {
      try {
        await sequelize.sync({ force: true });
        await Paper.bulkCreate(papers);
        console.log('Папери успішно додані.');
      } catch (error) {
        console.error('Помилка при додаванні паперів:', error);
      } finally {
        await sequelize.close();
      }
    });
};

importPapers();
