const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/CompleteAuthenticationdemo")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log("Error while conectiong mongodb", err);
  });

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // console.log("name",name,"email",email,"password",password);
  const user=await User.create({
    name,
    email,
    password,
  });
  res.send({msg:"success",user});
});
app.listen(8000, (err) => {
  if (!err) {
    console.log("Server is listening from port number 8000");
  }
});
