var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.set('view engine', 'ejs');
var gettyLibScraper = require('./scraper');
var postgresql =  require('./postgresql-orm/postgresql-orm.js')
var scramble = require('./scramble/scramble')
//process.env.NODE_ENV === 'postgresql-orm' ? require('./postgresql-orm') : console.log('no database');


app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/../client'));
// console.log(__dirname);



app.get('/', function(req, res){
  // Renders a view and sends the rendered HTML string to the client.
  res.render('./../client/start.ejs', {error: null});
});

app.post('/start', gettyLibScraper.getPaintings);
//  gettyLibScraper.getPaintings);

app.get('/scramble', function(req, res){
  //console.log('does scramble.randomPic exist?', scramble.randomPic);
  scramble.randomPic(function(picture){
    //console.log('did my function get the picture?', picture);
    res.render('./../client/game.ejs', {picture: picture});
  })
});

app.post('/check', function(req, res){
  console.log("req?",  req.body)
  var input = req.body;
  console.log('is this it??????',typeof input.Title)
  var schemaCreator = postgresql.paintingInfo();
  var foto = schemaCreator.findOne(
    {where: {title: input.Title}}).then(function(picture){
    console.log('is the pic here???', picture);
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!!');
})

module.exports = app;
