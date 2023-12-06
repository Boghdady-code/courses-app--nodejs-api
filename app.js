require("dotenv").config();
const express = require ("express");
const app = express();
const cors = require("cors");
app.use(express.json());
const controller = require("./controllers/controllers");
const userController = require("./controllers/user.controller");
const { validationSchema } = require("./validation/validation");
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
const verifyToken = require("./middlewares/verifyToken");
const userRoles = require("./utils/userRoles");
const allowedTo = require ("./middlewares/allowedTo");
const path = require ("path");
const multer = require ('multer');
const { json } = require("express");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb (null, 'uploads/imgs')
  },
  filename:function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`
    cb (null, fileName);
  }

})

const fileFilter = (req, file, cb)=> {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
   return cb(null, true)

  } else {
    return cb('the file must be an image',false);
  }

} 

const upload = multer ({storage:diskStorage, fileFilter} )
app.use ('/uploads/imgs', express.static(path.join(__dirname,'uploads/imgs')))
app.use(cors());
mongoose.connect(url).then(()=>{
  console.log("connected to database");
})

app.route('/api/courses')
              .get(controller.GetAllCourses)
              .post(verifyToken,allowedTo(userRoles.ADMIN),validationSchema(),controller.AddCourse);

app.route ('/api/courses/:id')
              .get(controller.GetSingleCourse)
              .patch(verifyToken,allowedTo(userRoles.ADMIN),controller.UpdateCourse)
              .delete(verifyToken,allowedTo(userRoles.ADMIN),controller.DeleteCourse);
            

app.route("/api/users").get(verifyToken, userController.getAllUsers);

app.route("/api/users/register").post(upload.single('avatar'),userController.register);

app.route("/api/users/login").post(userController.login);



//default routing
app.all ("*",(req,res)=>{
  res.status(404).json({status:"Error",message:"resource is not found"});
})  

app.listen(5000,()=>{
  console.log ("server running on port 5000");
})