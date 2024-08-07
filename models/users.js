const mongoose =require("mongoose");
const emailvalidator = require("email-validator");
const { Schema } = mongoose;

const userSchema = new Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validator:()=>{
        return emailvalidator.validate(this.email)
    }
  },
  password:{
    type:String,
    required:true
  }
});

const userModel = mongoose.model("userModel",userSchema);
module.exports = userModel;