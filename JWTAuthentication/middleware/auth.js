const authmiddlewarefunction = (req, res, next) => {
  const authdata = req.headers.authorization;
  if(!authdata)
  {
    
  }
  console.log("middleware called");
  next();
};
module.exports = { authmiddlewarefunction };
