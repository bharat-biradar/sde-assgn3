'use strict';
require('dotenv').config();
const express = require('express');

const app = express();

app.set('views', require('path').join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use('/books', require('./books/crud'));
app.use('/api/books', require('./books/api'));


app.get('/', (req, res) => {
  res.redirect('/books');
});



const port = 8080;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
