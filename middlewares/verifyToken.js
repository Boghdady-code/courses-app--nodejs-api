const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ status: "Error", message: "No token provided" })
  }
  const token = authHeader.split(' ')[1]
  try{
    const currentUser = jwt.verify(token, process.env.SECRET_KEY)
    req.currentUser=currentUser; // to get the current logged in user and use it in allowed to middleware.
  
    next();
  }
  catch(err){
    console.log(err)
    return res.status(401).json({ status: "Error", message: "Invalid token" })
  }
}

module.exports = verifyToken;