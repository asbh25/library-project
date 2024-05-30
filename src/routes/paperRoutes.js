const express = require("express");
const Paper = require("../models/paper");
const PDFDocument = require('pdfkit');

const router = express.Router();

// Create a new paper
router.post("/", async (req, res) => {
  try {
    const paper = await Paper.create(req.body);
    res.status(201).send(paper);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all papers with filtering and pagination
router.get('/', async (req, res) => {
  const { title, author, page = 1, limit = 10 } = req.query;
  const where = {};

  if (title) {
    where.title = { [Op.like]: `%${title}%` };
  }

  if (author) {
    where.authors = { [Op.contains]: [author] };
  }

  try {
    const papers = await Paper.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });
    res.status(200).send({
      totalItems: papers.count,
      totalPages: Math.ceil(papers.count / limit),
      currentPage: parseInt(page),
      papers: papers.rows
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a paper by ID
router.get("/:id", async (req, res) => {
  try {
    const paper = await Paper.findByPk(req.params.id);
    if (!paper) {
      return res.status(404).send();
    }
    res.status(200).send(paper);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a paper by ID
router.patch("/:id", async (req, res) => {
  try {
    const paper = await Paper.findByPk(req.params.id);
    if (!paper) {
      return res.status(404).send();
    }
    await paper.update(req.body);
    res.status(200).send(paper);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a paper by ID
router.delete("/:id", async (req, res) => {
  try {
    const paper = await Paper.findByPk(req.params.id);
    if (!paper) {
      return res.status(404).send();
    }
    await paper.destroy();
    res.status(200).send(paper);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Generate PDF for a paper by ID
router.get('/:id/pdf', async (req, res) => {
  try {
    const paper = await Paper.findByPk(req.params.id);
    if (!paper) {
      return res.status(404).send();
    }

    const doc = new PDFDocument();
    let filename = encodeURIComponent(paper.title) + '.pdf';
    res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');

    doc.fontSize(25).text(paper.title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text('Authors: ' + paper.authors.join(', '), { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(paper.abstract, { align: 'justify' });

    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
