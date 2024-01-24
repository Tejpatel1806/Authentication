const jwt = require("jsonwebtoken");
const jwtKey = "jwt";
const User = require("../models/user");

//have jyare client  /updateuser ni request mokalse tyare client e headers ma as a authorization key ma token value mokalse
const authmiddlewarefunction = async (req, res, next) => {
  const authdata = req.headers.authorization;
  console.log(authdata);
  //headers ma thi authorization ma thi e token lai lese
  // ane jose e token mokli j nai hoy to e user login nathi etle ene 401 response mokli daisu
  if (!authdata) {
    res.status(401).json({ msg: "User is not login please login first" });
  }
  //have aa data ma e object aavse je aapde token generate karavti vakhte lakhyu hatu e
  //have ema thi email na base par aapde e user ne lai lidho ane request ma user key ma eni value tarike e user object muki didho 
  const data = jwt.verify(authdata, jwtKey);
  console.log("data", data);
  const user = await User.findOne({ email: data.email });
  if (!user) {
    res.status(401).json({ msg: "User is not login please login first" });
  }
  req.user = user;
  next();
};
module.exports = { authmiddlewarefunction };
