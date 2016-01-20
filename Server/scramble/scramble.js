var Sequelize = require ('sequelize');
var Picture = require('./../postgresql-orm/postgresql-orm')
var scramble = {};
scramble.randomPic = randomPic;

// randomPic func takes a callback as the argument
//the randomPic function then gives the picture that it generated to the res.render back in the server file
function randomPic (callback) {
  var generatorOfRandomPic = Math.floor(Math.random()*357)
  // console.log('where is this callback', callback);
  var outcome = Picture.paintingInfo();
  //console.log('paintingInfo in scramble', outcome);
  var pic = outcome.findOne(
    {where: {number: JSON.stringify(generatorOfRandomPic)}
  }).then(function(picture){
    //console.log('is the pic here???', picture);
    callback(picture);
  });
  //console.log('picccc', pic);
}
module.exports = scramble;
