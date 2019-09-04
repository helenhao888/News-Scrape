var express = require("express");
var mongoose = require("mongoose");

var logger = require("morgan");

//initialize express
var app = express();
var PORT = process.env.PORT || 3000;

// var db = require("./models");
var db = require("./models");

// Make public a static folder
app.use(express.static("public"));

//Sets up Express-Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");


// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Connect to the Mongo DB
mongoose.set("useFindAndModify", false);
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost/newsdb", { useNewUrlParser: true });

// route
require("./routes/router.js")(app,db);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});


