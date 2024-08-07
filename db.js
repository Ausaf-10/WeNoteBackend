const mongoose = require("mongoose");
require('dotenv').config()
const db_link = `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPassword}@cluster0.odskqtk.mongodb.net/`;
connectToMongo = ()=>{
    mongoose.connect(db_link).then(()=>{
        console.log("Connected");
    }).catch((err)=>{
        console.log(err);
        console.log("Unable to connect to the database");
    })
}
module.exports = connectToMongo;