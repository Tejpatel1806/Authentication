const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const Blog = require("./models/blogs");
const app = express();
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const { checkForAuthenticationmCookie } = require("./middlewares/auth");
mongoose
  .connect("mongodb://127.0.0.1:27017/BlogApplication")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log("Error while conectiong mongodb", err);
  });
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.use(checkForAuthenticationmCookie("token"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.listen(8000, (err) => {
  if (!err) {
    console.log("Server Started at Port 8000");
  }
});
