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
      let comFlag = false;

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
         
          let resultObj = {
            headline: result.headline,
            summary : result.summary,
            url     : result.url
          }
        
          resultArr.push(resultObj);

          // db.News.create(result)
          // .then(function(dbNews) {
     
          //     count++;
          //     newsObject = {
          //       count: count,
          //       news: dbNews
          //     };
          //     res.json(
          //       { status: "success",                
          //         data: newsObject}
          //     )                 
             
          // })
          // .catch(function(err) {
          //   //skip duplicate key error 
          //   if( err.code !== 11000 ) {
              
          //     console.log("err ",err);
          //     console.log("err code",err.code);
          //     // newsObject = {
          //     //   count: count,
          //     //   news: ""
          //     // };
          //     res.json(
          //       { status: "fail",                
          //         data: err.errmsg}
          //     )
              
          //   }
          // }); //end of db catch
        
        
        }
         
      }); //end of article grabbing

      // Create all new news using the resultArr object array built from scraping
      createNewsDb(resultArr,req,res);  

    }); //end of get  
    
  }); //end of post


function createNewsDb(resultArr,req,res){
       
  // Create all new news using the resultArr object array built from scraping

  db.News.create(resultArr)
  .then(function(dbNews) {

      console.log("inserting", dbNews.length);  
      console.log("db News",dbNews);
      newsObject = {
        count:  dbNews.length,
        news: dbNews
      };
      res.json(
        { status: "success",                
          data: newsObject}
      )                 
     
  })
  .catch(function(err) {
    
    if( err.code !== 11000 ) {
      console.log(err);
      res.json(
        { status: "fail",                
          data: err.errmsg});

    } else  {
      //skip duplicate key error 
      console.log("err ",err);
      console.log("err code",err.code);
      newsObject = {
        //question can't catch exact inserted number 
        count: 0,
        news: ""
      };
      res.json(
        { status: "success",                
          data: newsObject}
      )
      
    }
  }); //end of db catch

  }


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


//save selected news 
app.post("/saveNews/:id",(req,res) =>{

  
  db.News.findOneAndUpdate({_id:req.params.id},{$set: {saved:true}}, { new: true })
    .then(dbNews =>{
      
      res.json(
         { status: "success",                
           data:   dbNews})      
    })
    .catch(err => {
      console.log("update news document error",err);
      res.json(
        { status: "fail",                
          data:   err.errmsg})
    })

});


//Get saved news
app.get("/savednews",(req,res) => {

    db.News.find({saved:true})
      .then((dbNews) => {
        // res.json({
        //   status: "success",
        //   data  : dbNews
        // })

        let hbsNews = {
          news: dbNews
          };
          // console.log(hbsObject);
        res.render("savedNews",hbsNews);  

      })
      .catch((err) =>{
        console.log("get saved news err ", err);
        res.json({
          status: "fail",
          data  : err.errmsg
        })
      })
})

// Route for saving/updating an Article's associated Note
app.post("/addNotes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Notes.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one news with an `_id` equal to `req.params.id`. 
      //Update the news to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated 
       return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbNews) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbNews);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/notes/:id",(req,res) =>{

  db.Notes.find({})
})

}; //end of export