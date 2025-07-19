const { JsonWebTokenError } = require('jsonwebtoken');
const HttpError = require('../models/errorModel')
const UserModel= require('../models/userModel')
const bcrypt= require("bcryptjs")
const jwt  = require("jsonwebtoken")
const uuid = require("uuid").v4;
const fs= require("path")
const path = require("path")
const cloudinary = require("../utils/cloudinary")



//REGISTER USER
//POST : api/users/register
//UNProtected

const registerUser = async(req, res, next) =>{
    try{
        const {fullName, email, password, confirmPassword} = req.body;
        if(!fullName || !email || !password || !confirmPassword) {
            return next(new HttpError("Fill in all fields", 422))
        }
        //make the email lowercased
        const lowerCasedEmail = email.toLowerCase();
        //check DB if email already exist 
        const emailExists= await UserModel.findOne({email: lowerCasedEmail})
        if(emailExists){
            return next(new HttpError("Email already exists", 422))
        }
        //check if password and confirm password match
        if(password!==confirmPassword){
            return next(new HttpError("Passwords do not match", 422))
        }
        //check password length
         if(password.length<6){
            return next(new HttpError("Password should be at least 6 characters", 422))
        }
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(password, salt);

    // add user to DB
    const newUser = await UserModel.create({fullName, email:lowerCasedEmail, password:hasedPassword})
    res.json(newUser).status(201);
    } catch(error){
         return next(new HttpError(error))
    }
}





//Login USER
//POST : api/users/login
//UNProtected


const loginUser=async(req, res, next) =>{
    try{
      const {email,password} = req.body;
      if(!email || !password){
         return next(new HttpError("Fill in all fields", 422))
      }
      //make email lowercased
      const lowerCasedEmail=email.toLowerCase();
      //fetch user from the DB
      const user = await UserModel.findOne({email:lowerCasedEmail})
      if(!user){
        return next(new HttpError("Invalid Credential", 422))
      }
      //const {uPassword, ...userInfo} = user;

      //compare passwords
      const comparedPass = await bcrypt.compare(password, user?.password);
      if(!comparedPass){
        return next(new HttpError("Invalid Credential", 422))
      }
      const token = await jwt.sign({id: user?._id}, process.env.JWT_SECRET,{expiresIn:"1h"})
      res.json({token, id: user?._id}).status(200)
      //res.json({token, id: user?._id, ...userInfo}).status(200)
    } catch(error){
         return next(new HttpError(error))
    }
}




//GET USER
//GET : api/users/:id
//Protected

const getUser=async(req, res, next) =>{
    try{
       const {id} = req.params;
       const user = await UserModel.findById(id)
       if(!user){
        return next(new HttpError("User not found", 422))
       }
       res.json(user).status(200)
    } catch(error){
         return next(new HttpError(error))
    }
}




//GET USER
//GET : api/users
//Protected

const getUsers = async(req, res, next) =>{
    try{
       const users = await UserModel.find().limit(10).sort({createdAt: -1})
       res.json(users);
    } catch(error){
         return next(new HttpError(error))
    }
}





//EDIT USER
//PATCH: api/users/edit
//Protected

const editUser = async(req, res, next) =>{
    try{
        const {fullName, bio} = req.body;
        const editedUser = await UserModel.findByIdAndUpdate(req.user.id, 
            {fullName, bio}, {new: true})
            res.json(editedUser).status(200)
    } catch(error){
         return next(new HttpError(error))
    }
}



//FOLLOW/UNFOLLOW  USER
//GET: api/users/:id/follow-unfollow
//Protected

const followUnfollowUser = async(req, res, next) =>{
    try{
        const userToFollowId = req.params.id;
        if(req.user.id == userToFollowId){
                return next(new HttpError("You can't follow/unfollow yourself",422))
        }
        const currentUser = await UserModel.findById(req.user.id);
        const isFollowing = currentUser?.following?.includes(userToFollowId);

        //follow if not followin, else unfollow if already if already following
        if(!isFollowing){
            const updateUser = await UserModel.findByIdAndUpdate(userToFollowId, {$push: {followers:req.user.id}}, {new:true})
            await UserModel.findByIdAndUpdate(req.user.id, {$push:{following: userToFollowId}}, {new:true})
            res.json(updateUser)
        }else{
            const updateUser = await UserModel.findByIdAndUpdate(userToFollowId, {$pull: {followers:req.user.id}}, {new:true})
            await UserModel.findByIdAndUpdate(req.user.id, {$pull:{following: userToFollowId}}, {new:true})
            res.json(updateUser)
        }
    } catch(error){
         return next(new HttpError(error))
    }
}





//Change USER Profile photo
//POST: api/users/avatar
//Protected

const changeUserAvatar = async(req, res, next) =>{
    try{
        if(!req.files.avatar){
            return next(new HttpError("Please choose an image", 422))
        }
        const {avatar}= req.files;
        //check file size
        if(avatar.size>500000){
            return next(new HttpError("Profile picture too big. Should be less than 500kb"))
        }
        let fileName= avatar.name;
        let splittedFilename = fileName.split(".")
        let newFilename= splittedFilename[0] + uuid() +"." +splittedFilename[splittedFilename.length -1]
       avatar.mv(path.join(__dirname, "..", "uploads", newFilename), async (err)=>{
               if(err){
                return next(new HttpError(err))
               }
               //store image on cloudinary
               const result = await cloudinary.uploader.upload(path.join(__dirname, "..", "uploads", newFilename),
            {resource_type:"image"});
            if(!result.secure_url){
                return next(new HttpError("Couldn't upload image to cloudinary", 422))
            }
            const updateUser = await UserModel.findByIdAndUpdate(req.user.id, {profilePhoto:result?.secure_url}, {new:true})
            res.json(updateUser).status(200)
       })

    } catch(error){
         return next(new HttpError(error))
    }
}

module.exports = {registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar}