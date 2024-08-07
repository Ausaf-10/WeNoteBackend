const express = require("express");
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const fetchUser = require("../Middleware/fetchUser")
const jwt = require("jsonwebtoken");
require('dotenv').config()
const jwtSK = process.env.jwtSK;
const saltRounds = 10;

const router = express.Router();

router.post("/signup",async (req, res) => {
  let success = false;
  var a = req.body;
  const user = await userModel.findOne({ email: a.email });
  if (user) {
    res.send({success,msg:"User Already Exist"});
  }
  else{
    bcrypt.genSalt(saltRounds, function (err, salt) {
    if (err) res.send({success,msg:"Sry! There is some error"});
    else {
      bcrypt.hash(a.password, salt,function (err2, hash) {
        if (err2) res.send({success,msg:"Sry! There is some error"});
        else {
          a.password = hash;
           userModel.create(a).then(() => {
              token = jwt.sign({ UID: a.email }, jwtSK);
              res.send({success:true,msg:token});
            }).catch((err) => {
              res.send({success,msg:err});
            });
        }
      });
    }
  });
}
});

router.post("/login", async (req, res) => {
  var a = req.body;
  let success = false;
  user = await userModel.findOne({ email: a.email });
  if (user) {
    bcrypt.compare(a.password, user.password, function (err, result) {
      if (err) {
        res.send({success,msg:err});
      } else if (!result) {
        res.send({success,msg:"Passwords doesn't matched"});
      } else {
        token = jwt.sign({ UID: a.email }, jwtSK);
        res.send({success:true,msg:token});
      }
    });
  } else {
    res.send({success,msg:"Not a valid email"});
  }
});

router.get("/getUser", fetchUser, async (req, res) => {
    res.send(req.body);
  });

module.exports = router;

