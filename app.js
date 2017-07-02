/* eslint linebreak-style: ["error", "windows"]*/

const express = require('express');
const path = require('path');
const ShortenedUrl = require('./app/shortenedUrl.class').ShortenedUrl;

const myapp = express();

// initial settings
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
    console.log(req.params.input);
    res.send(JSON.stringify(ShortenedUrl.shorten(req.params.input)));
});

// start-up server
myapp.listen(port, () => {
    console.log(`now listening on ${port}`);
});
