const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();

//aa niche ni line no matlab evo thay ke aapde je file upload karsu frontend ma thi e aapda backend ma /upload folder ni andar store thase
//pan aa je file upload kari te aapda uploads/ ni andar aavi gai pan aapde tene read nai kari sakie tena mate aapde storage banavu padse ena mate no code niche muajb che
// const upload = multer({ dest: "uploads/" });


//aa rite aapde potanu storage banavi sakie ane ema destination ma ek function hoy ema argument tarike req object hoy pachi file etle ke e file no object jene frontend ma thi user upload karva mage che te ane cb etle callback function
//callbackfunction argument tarike first error lese ane second location lese ke kya aapde te file ne store karavi che te 
//ane filename ma pan ek function hoy ema pan req,file ane callback function hoy ,callback function ma as a argument tarike first error aave pachi second file name aave ke ./uploads ni andar tame kaya name thi file upload karva mago cho te 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null,"./uploads")
  },
  filename: function (req, file, cb) {
    return cb(null,`${Date.now()}-${file.originalname}`)
  },
});
//pachi multer ma aapde e as a storage tarike pass karvanu 
//have aana thi je file upload thase e joi pan sakase 
const upload=multer({storage:storage});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.render("homepage");
});
app.post("/upload", upload.single("profileImage"), (req, res) => {
  console.log(req.body); //ahi req.body ma null aavse karan ke aapde koi data mokalta nai as a form na rup ma file upload karie chie pan te req.body ma nai aave
  console.log(req.file); //ahi req.file ma je file upload kari teni information hase like destination,filename,path etc..
  return res.redirect("/");
});
app.listen(8000, (err) => {
  if (!err) {
    console.log("Server is listening on port number 8000");
  }
});
