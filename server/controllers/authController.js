import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import {renameSync,unlinkSync} from "fs"
const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email,userId)=>{
    return jwt.sign({email,userId},process.env.JWT_KEY,{expiresIn:maxAge})
}
export const signUp = async (req,res,next)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).send("email and password is required")
    }
    const user = await User.create({email,password})
    res.cookie("jwt",createToken(email, user.id),{
      maxAge,
      secure:true,
      sameSite:"None",

    });
    return res.status(201).json({
      user:{
        id:user.id,
        email:user.email,
        password:user.password,
        profileSetUp:user.profileSetUp
      }

    })

  } catch (err) {
     console.log(err)
     //duplicate email break the server 
     return res.status(500).send("Internal server error")
  }
}
export const login = async (req,res,next)=>{
  try {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).send("email and password is required")
    }
    const user = await User.findOne({email})
    if(!user){
      return res.status(404).send("user with the given email not  found ")
    }
    const auth = await  compare(password,user.password);
    if(!auth){
       return res.status(400).send("Password is incorrect")
    }
    res.cookie("jwt",createToken(email, user.id),{
      maxAge,
      secure:true,
      sameSite:"None",

    });
    return res.status(200).json({
      user:{
        id:user.id,
        email:user.email,
        password:user.password,
        profileSetUp:user.profileSetUp,
        firstName: user.firstName,
        lastName: user.lastName,
        image:user.image,
        color:user.color
      }

    })

  } catch (err) {
     console.log(err)
     return res.status(500).send("Internal server error")
  }
}
export const  getUserInfo = async (req,res,next)=>{
  try {
      const userData = await User.findById(req.userId)
       if(!userData){
          return res.status(404).send("user with the given id not found")
       }
    return res.status(200).json({
      
        id:userData.id,
        email:userData.email,
        password:userData.password,
        profileSetUp:userData.profileSetUp,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image:userData.image,
        color:userData.color
      

    })

  } catch (err) {
     console.log(err)
     return res.status(500).send("Internal server error")
  }
}

export const  updateProfile = async (req,res,next)=>{
  
  try {
    const {firstName,lastName,color} = req.body
       if(!firstName||!lastName){
          return res.status(400).send("Firstname Lastname and color is required")
       }
       const userData = await User.findByIdAndUpdate(req.userId,{
         firstName,lastName,color,profileSetUp:true
       },{new:true,runValidators:true})
    return res.status(200).json({
      
        id:userData.id,
        email:userData.email,
        password:userData.password,
        profileSetUp:userData.profileSetUp,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image:userData.image,
        color:userData.color
      

    })

  } catch (err) {
     console.log(err)
     return res.status(500).send("Internal server error")
  }
}
export const  addProfileImage = async (req,res,next)=>{
  
  try {
    
       if(!req.file){
          return res.status(400).send("File is required")
       }
       const date = Date.now()
       let fileName = "uploads/profiles/"+date+req.file.originalname
       renameSync(req.file.path,fileName)
       const updatedUser = await User.findByIdAndUpdate(req.userId,{
          image:fileName
       },{new:true,runValidators:true})
       
    return res.status(200).json({
      
        image:updatedUser.image
       
      

    })

  } catch (err) {
     console.log(err)
     return res.status(500).send("Internal server error")
  }
}

export const  removeProfileImage = async (req,res,next)=>{
  
  try {
     const {userId} = req;
     const user = await User.findById(userId);
     if(!user){
       res.status(404).send("user not found")
     }
     if(user.image){
       unlinkSync(user.image)
     }
      user.image=null
      await user.save();
    return res.status(200).send("Profile image deleted successfully")

  } catch (err) {
     console.log(err)
     return res.status(500).send("Internal server error")
  }
}

export const  logOut = async (req,res,next)=>{
  
  try {
    console.log("Before logout:", req.cookies.jwt); // Debugging

    // Use clearCookie for proper deletion
    res.cookie("jwt",{},{
      maxAge:1,
      secure:true,
      sameSite:"None"
     
    });

    console.log("After logout:", req.cookies.jwt); // Should now be undefined
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
     console.log(err)
     return res.status(500).send("Internal server error")
  }
}