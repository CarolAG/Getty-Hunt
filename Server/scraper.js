var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var store = require('./postgresql-orm/postgresql-orm');
//var store = require('./postgresql-orm/paintingsModel');
require('events').EventEmitter.prototype._maxListeners = 9000;
var i = 0;
//scraper methods
var gettyLibScraper = {};
gettyLibScraper.getPaintings = getPaintings;

 function getPaintings (req, res) {
    // link to getty lib
    var paintingsDir = 'http://search.getty.edu/gateway/search?q&cat=type&rows=358&srt=a&dir=s&dsp=1&img=0&f=%22Paintings%22&types=%22Paintings%22&sources=%22J.%20Paul%20Getty%20Museum%22&pg=1';


    //doing an http get req to the getty lib pg to get a JSON obj
    request(paintingsDir, function(err, response){
      if (err) response.status(404).send('404 SOMETHING WENT HORRIBLY WRONG!!!')
      //loading the html of the getty pg into cheerio
      var $ = cheerio.load(response.body);
      //grab every painting summary on pg (DOM element the div). It's an obj if you console.log(grab1)
      var grab1 = $('.cs-result-data-brief', '#cs-content')
      var grab2 = $('.cs-result-image', '#cs-content')
      //var links = []
      var scavangerHuntInfo;

      var info = [];
      //console.log($(grab1).html())
      async.forEachOf(grab1, function(item, key, callback){
        var everyPainting = grab1[key]
        var everyImageThumbnail = grab2[key];


          $(everyPainting,'#cs-content').each(function(i,elem){
  scavangerHuntInfo = {};

            $(everyImageThumbnail,'#cs-content').each(function(i,elem){
              //console.log('grab2key?', $(everyImageThumbnail).html());
              //console.log('elem???????', elem);
                var theImageJpeg = $('.cs-enlarge', everyImageThumbnail).attr('href');
                if(theImageJpeg == undefined){
                  scavangerHuntInfo.image = 'image not available';
                } else {
                  scavangerHuntInfo.image = $('.cs-enlarge', everyImageThumbnail).attr('href');
                }
                console.log('IS THIS THE F^&* IMAGE URL??????????', $('.cs-enlarge', everyImageThumbnail).attr('href') );
              //console.log('everyPainting',$(everyPainting).text());
            })

            //console.log('elem', $(elem).html());
            //console.log('IS THIS THE F^&* IMAGE URL??????????', $('', elem).attr('href'));
            var lengthOfDateSect = $('td .cs-value', elem).eq(4).text().length;
            scavangerHuntInfo.link = $('a', elem).attr('href');
            scavangerHuntInfo.title = $('td .cs-value', elem).eq(0).text();
            scavangerHuntInfo.maker = $('td .cs-value', elem).eq(1).text();
            scavangerHuntInfo.medium = $('td .cs-value', elem).eq(3).text();
              if(lengthOfDateSect < 18){
                scavangerHuntInfo.date = $('td .cs-value', elem).eq(4).text();
              }else{
                scavangerHuntInfo.place = $('td .cs-value', elem).eq(4).text();
                scavangerHuntInfo.date = $('td .cs-value', elem).eq(5).text();
              }
            info.push(scavangerHuntInfo);
          })
      //gettyLibScraper.LocOfPainting(link, location);
      }, function(err){
        if (err)console.log('theres been an error grabbing a pic link');
        console.log('all pic links have been obtained');

        })
        //console.log('info', info);
        //store is the function that is being imported from the postgresql-orm file
        //console.log('store',store);
        store.creating(info);
        //res.status(200).send(info);
    })
     res.redirect('/scramble');

  }

//don't forget to exports! your obj, even if you are already 'requiring' the file elsewhere
module.exports = gettyLibScraper;
