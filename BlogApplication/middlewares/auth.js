const {
  createTokenForUser,
  validateTokenForUser,
} = require("../services/Authentication");

function checkForAuthenticationmCookie(cookie) {
  return (req, res, next) => {
    const tokencookievalue = req.cookies[cookie];
    if (!tokencookievalue) {
     return  next();
    }
    try {
      const userpayload = validateTokenForUser(tokencookievalue);
      req.user = userpayload;
    } catch (error) {}
    return next();
  };
}
module.exports={checkForAuthenticationmCookie};
