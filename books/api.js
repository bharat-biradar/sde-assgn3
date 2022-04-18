'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./firestore');

const router = express.Router();


router.use(bodyParser.json());


router.get('/', async (req, res) => {
  const { books, nextPageToken } = await db.list(10, req.query.pageToken);
  res.json({
    items: books,
    nextPageToken,
  });
});


router.post('/', async (req, res) => {
  const book = await db.create(req.body);
  res.json(book);
});


router.get('/:book', async (req, res) => {
  const book = await db.read(req.params.book);
  res.json(book);
});


router.put('/:book', async (req, res) => {
  const book = await db.update(req.params.book, req.body);
  res.json(book);
});


router.delete('/:book', async (req, res) => {
  await db.delete(req.params.book);
  res.status(200).send('OK');
});

module.exports = router;
