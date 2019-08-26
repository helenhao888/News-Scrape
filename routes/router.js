module.exports = function (app, db){
 
  var axios = require("axios");
  var cheerio = require("cheerio");

  // a route to get info from ny times news website
  app.get("/scrape",function(req,res){

    var count = 0; 

    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response){
      // Then, load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      //grab every h2 within an article tag
      $("article a").each(function(i,element){    
        console.log("i",i);
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object

        result.headline = $(this)
        //   .siblings("div")
          .children()
          .text();
        result.summary = $(this)
          .children("p")
          .text();
          
        result.url = $(this)
        //   .parent("a")
          .attr("href");

        if ( ! result.url.includes("http"))  {  
          result.url = "https:/www.nytimes.com" + result.url;
        };    

        if(result.title !== "" && result.summary !== "" && result.link !==""){  
          count++;

          console.log("result",result);
          // Create a new news using the `result` object built from scraping
          db.News.create(result)
            .then(function(dbNews) {
       
                console.log(dbNews);
            })
            .catch(function(err) {
              // If an error occurred, log it
                console.log(err);
            });
        }
      });
      console.log("count",count);
    });

    
  });



};