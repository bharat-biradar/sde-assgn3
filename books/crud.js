
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const images = require('../lib/images');
const db = require('./firestore');
const scanner = require('../lib/document_scanner');
const router = express.Router();

router.use(bodyParser.urlencoded({extended: false}));

router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

router.get('/', async (req, res) => {
  let {books, nextPageToken} = await db.list(10, req.query.pageToken);
  res.render('books/list.pug', {
    books,
    nextPageToken,
  });
});

router.get('/add', (req, res) => {
  res.render('books/form.pug', {
    book: {},
    action: 'Add',
  });
});

router.post(
  '/add',
  images.multer.single('image'),
  images.sendUploadToGCS,
  async (req, res) => {
    let data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      data.imageUrl = req.file.cloudStoragePublicUrl;
    }
    const scannedResult = await scanner.processDoc(req.file.path);
    for(var key in scannedResult) {
      data[key] = scannedResult[key];
    }
    const savedData = await db.create(data);

    res.redirect(`${req.baseUrl}/${savedData.id}`);
  }
);

router.get('/:book/edit', async (req, res) => {
  const book = await db.read(req.params.book);
  console.log(book);
  res.render('books/form.pug', {
    book,
    action: 'Edit',
  });
});

router.post(
  '/:book/edit',
  images.multer.single('image'),
  images.sendUploadToGCS,
  async (req, res) => {
    let data = req.body;
    if (req.file && req.file.cloudStoragePublicUrl) {
      req.body.imageUrl = req.file.cloudStoragePublicUrl;
    }
    const savedData = await db.update(req.params.book, data);

    res.redirect(`${req.baseUrl}/${savedData.id}`);
  }
);

router.get('/:book', async (req, res) => {
  const book = await db.read(req.params.book);
  res.render('books/view.pug', {
    book,
  });
});

router.get('/:book/delete', async (req, res) => {
  await db.delete(req.params.book);
  res.redirect(req.baseUrl);
});

module.exports = router;
