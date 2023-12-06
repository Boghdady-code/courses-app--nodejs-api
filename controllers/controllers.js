
let course = require("../mongoModel/model");
const {validationResult} = require('express-validator');
let GetAllCourses = async(req,res)=>{
  let query = req.query;
  let limit = query.limit || 10;
  let page = query.page || 1;
  let skip = (page - 1) * limit;
  const courses = await course.find({}, {"__v": false}).limit(limit).skip(skip);
  res.json({status:"success",data:{courses}});
  
  
};

let GetSingleCourse = async(req,res)=>{
try{
  let getCourse = await course.findById(req.params.id);
  if(getCourse === null){
    return res.status(404).json({status:"fail",message:"course not found"});
  }
  return  res.json({status:"success",data:{getCourse}});
} catch(err){
  return res.status(400).json({status:"Error", message:err.message, data:null});

} 
  
}

let AddCourse = async(req,res)=>{
  let errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({status:"Fail", data: errors.array()});
  }


  const newCourse = new course(req.body);
  await newCourse.save();


  res.status(201).json({status:"success",data:{newCourse}});

}

let UpdateCourse = async (req,res)=>{
  try{
    let selectedCourse = await course.findById(req.params.id);
    let updatedCourse = await course.updateOne({_id:req.params.id},{$set:{...req.body}});
    if(selectedCourse == null){
    return res.status(404).json({status:"fail", message:"course not found"});
  }
  
  return res.status(200).json({status:"success", data:{updatedCourse}});
  }catch(err){
    return res.status(400).json({status:"Error", message:err.message, data:null});
    
  }
  
}


let DeleteCourse =async (req,res)=>{
  let selectedCourse = await course.findById(req.params.id);
  if (selectedCourse == null){
    return res.status(404).json({status:"fail", message:"course not found"});
  }
  let deletedCourse = await course.deleteOne({_id:req.params.id});
  
  res.status(200).json({status:"success", data:null});
}

module.exports = {
  GetAllCourses,
  GetSingleCourse,
  AddCourse,
  UpdateCourse,
  DeleteCourse
}