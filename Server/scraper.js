var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
require('events').EventEmitter.prototype._maxListeners = 9000;
var i = 0;

//scraper methods
var gettyLibScraper = {
  getPaintings : function(req, res, next) {
    // link to getty lib
    var paintingsDir = 'http://search.getty.edu/gateway/search?q&cat=type&rows=358&srt=a&dir=s&dsp=1&img=0&f=%22Paintings%22&types=%22Paintings%22&sources=%22J.%20Paul%20Getty%20Museum%22&pg=1';


    //doing an http get req to the getty lib pg to get a JSON obj
    request(paintingsDir, function(err, response){
      if (err) response.status(404).send('404 SOMETHING WENT HORRIBLY WRONG!!!')

      //loading the html of the getty pg into cheerio
      var $ = cheerio.load(response.body);
      //grab every painting summary on pg (DOM element the div). It's an obj if you console.log(grab1)
      var grab1 = $('.cs-result-data-brief', '#cs-content')
      //var links = []
      var scavangerHuntInfo;
      var info = [];

      async.forEachOf(grab1, function(item, key, callback){
        var everyPainting = grab1[key]
        //console.log($(everyPainting).text());
          $(everyPainting,'#cs-content').each(function(i,elem){
            scavangerHuntInfo = {}
            //console.log($('a', elem).attr('href'));
            var lengthOfDateSect = $('td .cs-value', elem).eq(4).text().length;
            scavangerHuntInfo.link = $('a', elem).attr('href')
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
        console.log('info', info);
        res.status(200).send(info);
      })
  }

  // LocOfPainting: function(link,location){
  //   var imgLocTxt;
  //
  //   //opening every img's pg
  //    request(link, function(err,response){
  //     if (err) console.log('something wrong with making a request to a pic link', err);
  //     //loading html onto cheerio
  //     if (response){
  //       i++;
  //     var $$ = cheerio.load(response.body);
  //     // grabbing loc of painting in the museum
  //      imgLocTxt = $$('.text-center','#object-primary-image').text();
  //     console.log('imglocTxt',imgLocTxt, i)
  //     location.push(imgLocTxt);
  //   }
  //
  //
  //   })
  //
  // }

}

//don't forget to exports! your obj, even if you are already 'requiring' the file elsewhere
module.exports = gettyLibScraper;
