const { createHmac, randomBytes } = require("node:crypto");
const {createTokenForUser,validateTokenForUser} =require("../services/Authentication")
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

//aapde evu karvu che ke jyare koi navo user save thay database ma tyare aapde tena password ne hash karine database ma store karavo che
//userSchema.pre("save",function(){}) means jyare pan userSChema par save method aavse tyare aa function execute thase
userSchema.pre("save", function (next) {
  //aama this etle e user ke jena par save method lagi che e etle e user ne aapde koi const user name na variable ma store karai didhu
  const user = this;
  //have aapde joie chie ke password modified che ke nai em karan ke jo password alread hashed hoy to ene fari hash karvani jarur nathi etla mate aa lakhie chie condition
  if (!user.isModified("password")) return;
  //have randomBytes(16) means ek 16 digit no random number generate karayo ane ene toString ma convert kari ne salt ma store karayu
  const salt = randomBytes(16).toString();
  //have sha256 ni madad thi aapde user.password ne encrypt karyu
  const hashedpassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  //je current user par save method lagi che tena  password ma aapde hashedpassword set kari didhu
  this.salt = salt;
  this.password = hashedpassword;
  next();
});

userSchema.static("matchpasswordAndgeneratetoken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User Not Found");
  const salt = user.salt;
  const hashedpassword = user.password;
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (hashedpassword !== userProvidedHash) {
    throw new Error("Incorrect Password");
  }
  const token=createTokenForUser(user);
  return token;
});

const User = mongoose.model("user", userSchema);

module.exports = User;
