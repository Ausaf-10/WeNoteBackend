const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
  title:{
    type:String,
    required: true
  },
  description:{
    type:String,
    required:true
  },
  tag:{
    type:String,
    default:"General"
  },
  timestamp:{
    type:Date,
    default:Date.now
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
  
});
const notesModel = mongoose.model("notesModel",notesSchema);
module.exports = notesModel;
