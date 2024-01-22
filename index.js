const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const key = "password";
const jwt = require("jsonwebtoken");
const jwtKey = "jwt";
const algo = "aes256";
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
mongoose
  .connect("mongodb://127.0.0.1:27017/Authenticationdemo")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log("Error while conectiong mongodb", err);
  });

app.get("/", (req, res) => {
  res.end("HEllo");
});
app.post("/register", jsonParser, async (req, res) => {
  const cipher = crypto.createCipher(algo, key);
  const encrypted =
    cipher.update(req.body.password, "utf8", "hex") + cipher.final("hex");
  //   console.log(encrypted);
  const password = req.body.password;
  const body = req.body;
  const result = await User.create({
    name: body.name,
    email: body.email,
    address: body.address,
    password: encrypted,
  });
  jwt.sign({ result }, jwtKey, { expiresIn: "300s" }, (err, token) => {
    res.status(201).json({ msg: "Entry created done", token });
  });
});

app.post("/login", jsonParser, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const decipher = crypto.createDecipher(algo, key);
  const decrypted =
    decipher.update(user.password, "hex", "utf8") + decipher.final("utf8");
  console.log("decrypted", decrypted);
  if (decrypted === req.body.password) {
    jwt.sign({ user }, jwtKey, { expiresIn: "300s" }, (err, token) => {
      res.status(201).json({ msg: "User succesfully Login", token });
    });
  }
});

//ahi uper aapde crypto ni madad thi password ne encrypt ane decrypt karyu che pan have bcryptjs ni madad thi karsu aapde encryption and decryption password nu
app.post("/passwordbcrypt/register", jsonParser, async (req, res) => {
  const saltRound = 10; //same as const saltRound=await bcrypt.genSalt(10);
  //bcrypt.hash function che te aapda password ne hash code ma convert kari dese ane pachi database ma store karse
  //have ene ahi na lakhvu hoy to aapde ene models ma j jya user banayu che tya pre method ma lakhi sakie pre("save",function(){}) aavu karine eno matlab evo thay ke jyare database ma kaik store thay e pehla aa function execute thay ane e function ma aapde password ne encrypt kari sakie em 
  const hash_password = await bcrypt.hash(req.body.password, saltRound);
  const result = await User.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    password: hash_password,
  });
  // console.log(hash_password);
  res.json({ msg: "User created succesfully" });
});

app.post("/passwordbcrypt/login", jsonParser, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  //bcrypt.compare che te true ka to false return karse te req.body.password ane user no je database ma password che e banne ne compare karse ane jo e same hase to true return karse baki e false return karse
  const decrypted = await bcrypt.compare(req.body.password, user.password);
  console.log("decrypted", decrypted);
  res.status(201).json({ msg: "User succesfully Login" });
});

app.listen(8000, (err) => {
  if (!err) {
    console.log("Listening from port 8000");
  }
});
