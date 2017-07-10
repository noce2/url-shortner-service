/* eslint linebreak-style: ["error", "windows"]*/

const express = require('express');
const path = require('path');
const ShortenedUrl = require('./app/shortenedUrl.class').ShortenedUrl;

const myapp = express();
const dbUri = process.env.MONGODB_URI;

const dbUrl = dbUri || 'mongodb://localhost:27017/';
let dbName;
if (dbUri) {
  dbName = '';
} else {
  dbName = 'urlShortenerService';
}


const dbColName = process.env.dbColName || 'shortenedUrls';

function createFullUrl(input) {
  const tobeAppended = /(https?:\/\/)/
  if (!tobeAppended.test(input)) {
    return `http://${input}`;
  }
  return input;
}

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
  shortenedUrl.shorten(req.params.input)
    .then((fulfilled) => {
      res.json(fulfilled);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

myapp.get('/redigirme/:input', (req, res) => {
  shortenedUrl.original(req.params.input)
    .then((fulfilled) => {
      if(fulfilled.shortened) {
        console.log(createFullUrl(fulfilled.original));
        res.redirect(307, createFullUrl(fulfilled.original));
      } else {
        res.json(fulfilled);
      }

    }).catch((err) => {
      if (err) throw err;
    });
});

// start-up server
myapp.listen(port, () => {
  console.log(`now listening on ${port}`);
});

module.exports.myapp = myapp;
