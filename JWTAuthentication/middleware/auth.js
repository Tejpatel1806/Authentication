const authmiddlewarefunction =(req,res,next)=>{
  console.log(req.headers);
  console.log("middleware called");
  next();
}
module.exports={authmiddlewarefunction};