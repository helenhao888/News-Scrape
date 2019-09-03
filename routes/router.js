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
        
        
        }
         
      }); //end of article grabbing

      // Create all new news using the resultArr object array built from scraping
      createNewsDb(resultArr,req,res);  

    }); //end of get  
    
  }); //end of post


function createNewsDb(resultArr,req,res){
       
  // Create all new news using the resultArr object array built from scraping
  let errCount = 0;

  db.News.create(resultArr)
  .then(function(dbNews) {

      
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
      console.log("err code",err.code);
      errCount ++;      
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


  // app.get("/news",function(req,res){
app.get("/",function(req,res){
    db.News.find({})  
      .then(function(newsData){
        var hbsObject = {
          news: newsData
        };
       
        res.render("news",hbsObject);
      })   
      .catch(function(err){
        console.log("err",err);
      })
  }); //end of get 


//save selected news 
app.put("/saveNews/:id",(req,res) =>{

  
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

        let hbsNews = {
          news: dbNews
          };
         
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

app.put("/unsavenews/:id",(req,res) => {
 
  
  db.News.findOneAndUpdate({_id:req.params.id},{$set: {saved:false}}, { new: true })
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
})


// Route for saving/updating an Article's associated Note
app.post("/addNotes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one news with an `_id` equal to `req.params.id`. 
      //Update the news to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated 
       db.News.findOneAndUpdate({ _id: req.params.id }, { "$push":{ notes: dbNote._id }}, { new: true })
       .then(function(dbNews) {
       
        // If  successfully update an Article, send it back to the client
        res.json({
          status: "success",
          data: dbNote});
      })
      .catch(function(err){
        console.log("update news err",err);
      })
    })   
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json("create note err",err);
    });
});

app.get("/notes/:id",(req,res) =>{
  

  db.News.findOne({ _id: req.params.id })
    .populate("notes")
    .then( dbNews =>{     
       
      res.json({
        status: "success",
        data: dbNews});
    })
    .catch( err =>{
      console.log("read news err",err);
      res.json(err);
    })     
   
 
});


app.delete("/deleteNotes/:id",(req,res) =>{

  db.Note.remove({_id:req.params.id})
  .then( dbNote =>{
     
     res.json({
      status: "success",
      data: dbNote});
  })

});

}; //end of export