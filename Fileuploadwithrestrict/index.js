const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});


// const upload = multer({ storage: storage,
//   fileFilter:(req,file,cb)=>{
//       console.log(file);
//       if(file.mimetype==="image/png"  || file.mimetype==="image/jpg" || file.mimetype==="image/jpeg"  )
//       {
//           cb(null,true);
//       }
//       else
//       {
//           cb(null,false);
//           return cb (new Error('Only png and jpg format allowed!!'));
//       }
//   } })
  // limits:{fileSize:maxsize}});

const maxsize = 2 * 1024 * 1024; //approax 2MB
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
  limits:{fileSize:maxsize}
});


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("homepage");
});
app.post("/upload", upload.single("profileImage"), (req, res) => {
  console.log(req.body);
  console.log(req.file);
  return res.redirect("/");
});
app.listen(8000, (err) => {
  if (!err) {
    console.log("Server is listening on port number 8000");
  }
});
