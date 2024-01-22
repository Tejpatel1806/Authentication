const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtKey = "jwt";
const {authmiddlewarefunction} =require("./middleware/auth");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
mongoose
  .connect("mongodb://127.0.0.1:27017/Authenticationdemo")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log("Error while conectiong mongodb", err);
  });

app.post("/register", jsonParser, async (req, res) => {
  const saltRound = 10; 
  const hash_password = await bcrypt.hash(req.body.password, saltRound);
  const result = await User.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    password: hash_password,
  });
  res.json({ msg: "User created succesfully" });
});

app.post("/login", jsonParser, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const decrypted = await bcrypt.compare(req.body.password, user.password);
 if(decrypted)
 {
    const jwttokengenerate=jwt.sign({name:user.name,email:user.email,address:user.address},jwtKey);
    res.json({user,token:jwttokengenerate});
 }
 else
 {
    res.json({msg:"Email or password is incorrect"});
 }
});

//have aapde evu karvu che ke je user e login karyu hoy ej khali updateuser kari sake 
app.post("/updateuser", authmiddlewarefunction,(req, res) => {
    res.end("Hello from the post request method on /updateuser");
  });
app.listen(8001, (err) => {
  if (!err) {
    console.log("Listening from port 8001");
  }
});
