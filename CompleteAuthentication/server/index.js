const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

mongoose
  .connect("mongodb://127.0.0.1:27017/CompleteAuthenticationdemo")
  .then(() => console.log("Mongodb connected"))
  .catch((err) => {
    console.log("Error while conectiong mongodb", err);
  });

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  // console.log("name",name,"email",email,"password",password);
  const user = await User.create({
    name,
    email,
    password,
  });
  res.send({ msg: "success", user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (!user) {
    res.json({ Login: false, msg: "no record for User" });
  } else {
    if (user.password === password) {
      //access token ane refresh token banne ni secret key alag alag hoy
      const accessToken = jwt.sign(
        { email: email },
        "jwt-access-token-secret-key",
        { expiresIn: "1m" }
      );
      const refreshToken = jwt.sign(
        { email: email },
        "jwt-refresh-token-secret-key",
        { expiresIn: "5m" }
      );
      res.cookie("accessToken", accessToken, { maxAge: 60000 });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 300000,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.json({ Login: true });
    }
  }
});

const verifyuser = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  console.log(accessToken);
  if (!accessToken) {
    if (renewToken(req, res)) {
      next();
    }
  } else {
    jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "Invalid token" });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

const renewToken = (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  let exist = false;
  if (!refreshtoken) {
    return res.json({ valid: false, message: "No Refresh token" });
  } else {
    jwt.verify(refreshtoken, "jwt-refresh-token-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "Invalid Refresh Token" });
      } else {
        const accessToken = jwt.sign(
          { email: decoded.email },
          "jwt-access-token-secret-key",
          { expiresIn: "1m" }
        );
        res.cookie("accessToken", accessToken, { maxAge: 60000 });
        exist = true;
      }
    });
  }
  return exist;
};
app.get("/dashboard", verifyuser, (req, res) => {
  return res.json({ valid: true, message: "authorized" });
});
app.listen(8000, (err) => {
  if (!err) {
    console.log("Server is listening from port number 8000");
  }
});
