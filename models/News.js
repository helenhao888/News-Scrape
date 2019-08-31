var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NewsSchema = new Schema ({
  headline: {
    type: String,
    required: true,
    unique:true
  },
  summary: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  saved:{
    type: Boolean,
    required: true,
    default : false
  }, 
  // `notes` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Note model
  // This allows  to populate the News with any associated Notes
  notes: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Note model
      ref: "Note"
    }
  ]
});

var News = mongoose.model("News",NewsSchema);

module.exports = News;
