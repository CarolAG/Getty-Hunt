var cheerio = require('cheerio');
var request = require('request');

//scraper methods
var gettyLibScraper = {
  getPaintings : function(req, res, next) {
    //link to getty lib
    var paintingsDir = 'http://search.getty.edu/gateway/search?q&cat=type&rows=359&srt=a&dir=s&dsp=1&img=0&f=%22Paintings%22&types=%22Paintings%22&sources=%22J.%20Paul%20Getty%20Museum%22&pg=1';
    //doing an http get req to the getty lib pg to get a JSON obj
    request(paintingsDir, function(err, response){
      if (err) response.status(404).send('404 SOMETHING WENT HORRIBLY WRONG!!!')
      //Show the body of the req, which is the html for the getty lib
      //console.log('html', response.body)
      //loading the html of the getty pg into cheerio
      var $ = cheerio.load(response.body);
      //grab every painting summary on pg (DOM element the div)
      var grab1 = $('.cs-result-data-brief', '#cs-content')
      var location = [];
      //var linksArr =[];
      //for .each painting summary do this func(i[every], elem(div class ..'data-brief'))
      grab1.each(function(i, elem){
        //for every elem(a.k.a div(a.k.a painting summary)), .find the link to the painting.
        var link = $(elem).find('a').attr('href');
        //saving the text grabbed from chasing every img's link. Use a .then maybe if I figure it out
        var locationTxt = gettyLibScraper.LocOfPainting(link);
         //linksArr.push(link);
         console.log('locationTxt', locationTxt);
         location.push(locationTxt);
      })
      res.status(200).send(location);
    })
    //res.send('page');
  },

  LocOfPainting: function(link){
    //opening every img's pg
    console.log('link inside LocFunc', link)
    request(link, function(err, response){
      if (err) throw err;
      //loading html onto cheerio
      var $$ = cheerio.load(response.body);
      // grabbing loc of painting in the museum
      var imgLocTxt = $$('.text-center','#object-primary-image').text();
      console.log('imglocTxt',imgLocTxt)
      return imgLocTxt;
    })
  }


}

//don't forget to export! your obj, even if you are requiring the file elsewhere
module.exports = gettyLibScraper;
