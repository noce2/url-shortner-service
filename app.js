/* eslint linebreak-style: ["error", "windows"]*/

const express = require('express');
const path = require('path');
const ShortenedUrl = require('./app/shortenedUrl.class').ShortenedUrl;

const myapp = express();
const dbUrl = process.env.dbUrl || 'mongodb://localhost:27017/';
const dbName = process.env.dbName || 'urlShortenerService';
const dbColName = process.env.dbColName || 'shortenedUrls';

// initial settings
const shortenedUrl = new ShortenedUrl(dbUrl, dbName, dbColName);
const port = process.env.PORT || 5000;
myapp.use('/public', express.static(path.join(__dirname, 'public')));
myapp.set('port', port);
myapp.set('view engine', 'pug');
myapp.set('views', './views');

// routing

myapp.get('/', (req, res) => {
  res.render('index');
});

myapp.get('/reducirlo/:input', (req, res) => {
    
});

// start-up server
myapp.listen(port, () => {
  console.log(`now listening on ${port}`);
});

module.exports.myapp = myapp;
