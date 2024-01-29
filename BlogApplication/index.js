const express=require("express");
const mongoose = require("mongoose");
const path=require("path");
const app=express();
const userRoute=require("./routes/user");
mongoose
  .connect("mongodb://127.0.0.1:27017/BlogApplication")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log("Error while conectiong mongodb", err);
  });
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');
app.set("views",path.resolve("./views"));
app.use("/user",userRoute);
app.get("/",(req,res)=>{
    res.render("home");
})
app.listen(8000,(err)=>{
    if(!err)
    {
        console.log('Server Started at Port 8000');
    }
})