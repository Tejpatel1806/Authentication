const express = require("express");
const Blog = require("../models/blogs");
const Comment = require("../models/comment");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    return cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});
router.post("/", upload.single("coverImageURL"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  console.log(req.body);
  console.log(req.file);
  res.redirect(`blog/${blog._id}`);
});

router.get("/:id",async (req,res)=>{
  //populate no matlab evo thay ke Blog model ma je createdBy che te bija collection ne point kare che to aapde te collection ni value createdBy ma as a object tarike muksu etle have blog ne print karavsu etle te createdBy ma user no object muki dese
  //ane without populate print karavsu to te createdBy ma khali value j mukse means only ObjectIds
const blog=await Blog.findById(req.params.id).populate("createdBy");
console.log(blog);
const comment=await Comment.find({blogId:req.params.id}).populate("createdBy");
console.log("comment",comment);
return res.render("Blogdetails",{
  user:req.user,
  blog:blog,
  comment:comment,
})
});


router.post("/comment/:blogId",async (req,res)=>{
     await Comment.create({
      content:req.body.content,
      blogId:req.params.blogId,
      createdBy:req.user._id,
     });
     return res.redirect(`/blog/${req.params.blogId}`);
})
module.exports = router;
