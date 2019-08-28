module.exports = function (app, db){
 
  const axios = require("axios");
  const cheerio = require("cheerio");
  let newsObject

  // a route to get info from ny times news website
  app.post("/scrape",function(req,res){

    let count = 0; 
    const resultArr =[];
    const result = {};

    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response){
      // Then, load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      //grab every a within an article tag
      $("article a").each(function(i,element){   
       
        // Add the text and href of every link, and save them as properties of the result object

        result.headline = $(this)       
          .children()
          .text();
        result.summary = $(this)
          .children("p")
          .text();
          
        result.url = $(this).attr("href");

        if ( ! result.url.includes("http"))  {  
          result.url = "https:/www.nytimes.com" + result.url;
        };    

        if(result.title !== "" && result.summary !== "" && result.link !==""){  
          count++;
          let resultObj = {
            headline: result.headline,
            summary : result.summary,
            url     : result.url
          }
        
          resultArr.push(resultObj);
        
        }
          
         
         
      }); //end of article grabbing
      
       
        // Create all new news using the resultArr object array built from scraping
        db.News.create(resultArr)
        .then(function(dbNews) {
   
            console.log("inserting", dbNews.length);  
            newsObject = {
              count: count,
              news: dbNews
            };
            res.json(
              { status: "success",                
                data: newsObject}
            )
            // res.render("news",newsObject);      
           
        })
        .catch(function(err) {
          
          if( err.code !== 11000 ) {
            console.log(err);
          } else  {
            console.log("err ",err);
            console.log("err code",err.code);
            newsObject = {
              count: count,
              news: ""
            };
            res.json(
              { status: "success",                
                data: newsObject}
            )
            //skip error 
          }
        }); //end of db catch
   
    }); //end of get  
    
  }); //end of post

  app.get("/news",function(req,res){

    db.News.find({})  
      .then(function(newsData){
        var hbsObject = {
          news: newsData
        };
        // console.log(hbsObject);
        res.render("news",hbsObject);
      })   
      .catch(function(err){
        console.log("err",err);
      })
  }); //end of get 




}; //end of export