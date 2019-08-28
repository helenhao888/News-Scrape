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
  note:{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var News = mongoose.model("News",NewsSchema);

module.exports = News;
