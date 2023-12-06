let User = require('../mongoModel/usersModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

getAllUsers = async (req, res) => {
   let query = req.query;
   let limit = query.limit || 10;
   let page = query.page || 1;
   let skip = (page - 1) * limit;
   const users = await User
     .find({}, { "__v": false ,"password": false })
     .limit(limit)
     .skip(skip);
   res.json({ status: "success", data: { users } });
  
}

register = async (req, res) => {
  const oldUser = await User.findOne({ email: req.body.email });
  if (oldUser) {
    return res.status(409).json({ status: "fail", message: "user already exists" });
  }
  try {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      avatar: req.file.filename
    });

   const token = await jwt.sign(
      { email: newUser.email, _id: newUser._id, role:newUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "20d" }
    )
    newUser.token = token



    await newUser.save();
    return res.status(201).json({ status: "success", data: { newUser } });
  } catch(err){
    return res.status(400).json({ status: "Error", message: err.message, data: null });
  }
  
}

login = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    return res.status(400).json({ status: "fail", message: "Fields are required" });
  }
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ status: "fail", message: "invalid email or password" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: "fail", message: "invalid email or password" });
    }
    const token = await jwt.sign(
      { email: user.email, _id: user._id, role:user.role},
      process.env.SECRET_KEY,
      { expiresIn: "20d" }
    );

    return res.status(200).json({ status: "success", data: { token } });
  }
  catch(err){
    return res.status(400).json({ status: "Error", message: err.message, data: null });
  }
}

module.exports = {
  getAllUsers,
  register,
  login
}