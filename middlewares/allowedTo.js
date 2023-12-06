module.exports = (...roles)=> {
 
  return (req,res,next) => {
    if (!roles.includes(req.currentUser.role)) {
      return next(res
        .status(401)
        .json({ status: "fail", message: "You're not Authorized" }));
    } 
    next();
  }

}