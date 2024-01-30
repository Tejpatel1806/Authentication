const express = require("express");
const User = require("../models/user");
const router = express.Router();
router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect("/");
});
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const token = await User.matchpasswordAndgeneratetoken(email, password);
    console.log("token", token);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (err) {
    res.render("signin",{
        error:"Incorrect email or password"
    })
  }
});
router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("/");
})
module.exports = router;
