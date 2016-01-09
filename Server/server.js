var express = require('express');
var app = express();
var gettyLibScraper = require('./scraper');

app.get('/', gettyLibScraper.getPaintings)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!!');
})
