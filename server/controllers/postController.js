const HttpError=require("../middleware/errorMiddleware")
const PostModel=require('../models/postModel')
const UserModel=require('../models/userModel')
const{v4: uuidv4}=require('uuid') 
const cloudinary=require('../utils/cloudinary')
const fs=require('fs')
const path=require('path')
//CREATE POST
//POST:api/posts
//PROTECTED
const createPost=async(req,res,next)=>{
  try{
    const{body}=req.body;
    if(!body){
      return next(new HttpError("Fill in the text field and choose image",422))
    }
    if(!req.files.image)
    {
      return next(new HttpError("Please choose an image",422));
    }
    else{
      const{image}=req.files;
      //imags should be less than 1mb
      if(image.size>1000000)
      {
        return next(new HttpError("Profile pucture too big.Should be less thgan 500kb"),422)
      }
      //rename image
    }

    
    let fileName=image.name;
    fileName=fileName.split(".");
    fileName=fileName[0]+uuid()+"."+fileName[fileName.length-1];
    await image.mv(path.join(__dirname, '..','uploads',fileName),async(err)=>{
      if(err)
      {
        return next(new HttpError("err"))
      }
      //store image on cloudinary
      const result=await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads', fileName),{resource_type:"image"})
      if(!result.secure_url)
        {
          return next(new HttpError("couldn't upload image to cloudinary",422))
        }
      //save the post to db
      constnewPost=await PostModel.create({creator:req.user.id,body,image:result.secure_url})
      await UserModel.findbyIdAndUpdate(newPost?.creator, {$push: {posts: newPost?._id}})
      res.json(newPost)
  
      })
    }
  
  catch(error){
    return next(new HttpError(error))
  }
}
   
  //GET POST
  //GET: api/posts//PROTECTED
  const getPost=async(req,res,next)=>{
    try{
      const{id}=req.params;
      const post=await PostModel.findById(id)
      //const post=await PostModel.findById(id).populate("creator").populate({path:"comments",options:{sort:{createdAt:-1}}})
      res.json(post)
    }
    catch(error){
      return next(new HttpError(error)) 
    }
  }
  //GET POSTS
  //GET: api/posts
  // //PROTECTED
  const getPosts=async(req,res,next)=>{
    try{
      const posts=await PostModel.find().sort({createdAt:-1})
      res.json(posts)
    }
    catch(error){
      return next(new HttpError(error)) 
    }
  }
  //UPDATE POSTS
  //PATCH: api/posts
  // //PROTECTED
  const updatePost=async(req,res,next)=>{
    try{
      const postId=req.params.id;
      const{body}=req.body;
      //get post from db
      const post=await PostModel.findById(postId);
      //check if creator of the post is the logged in user
      if(post?.creator !=req.user.id){
        return next(new HttpError("You can't update this post since you are not the creator",403))
      }
      const updatedPost=await PostModel.findByIdAndUpdate(postId,{body},{new:true})
      res.json(updatedPost).status(200)
    }
    catch(error){
      return next(new HttpError(error)) 
    }
  }
  //DELETE POSTS
  //PATCH: api/posts/:id
  // //PROTECTED
  const deletePost=async(req,res,next)=>{
    try{
      const postId=req.params.id;
      //get post from db
      const post=await PostModel.findById(postId);
      //check if creator of the post is the logged in user
      if(post?.creator !=req.user.id){
        return next(new HttpError("You can't delete this post since you are not the creator",403))
      }
      const deletedpost=await PostModel.findByIdAndDelete(postId);
      await UserModel.findByIdAndUpdate(newPost?.creator,{$pull: {posts: post?._id}})
      res.json(deletedpost)
    }catch(error){
      return next(new HttpError(error)) 
    }
  }
  //LIKE/DISLIKE  POSTS
  //GEt: api/posts/:id/like
  // //PROTECTED
  const likeDislikePost=async(req,res,next)=>{
    try{
      const{id}=req.params;
      const post=await PostModel.findById(id);
      //check if the logged in user has already liked post
      if(post?.likes.includes(req.user.id)){
        updatedPost=await PostModel.findByIdAndUpdate(id,{$pull:{likes:req.user.id}},{new:true})
      }
        else{
          updatedPost=await PostModel.findByIdAndUpdate(id,{$push:{likes:req.user.id}},{new:true})  
        }
        res.json(updatedPost)

        
      }
    
    catch(error){
      return next(new HttpError(error)) 
    }
  }
  //GET USER POSTS
  //GEt: api/users/:id/posts
  // //PROTECTED
  const getUserPosts=async(req,res,next)=>{
    try{
      const userId=req.params.id;
      const posts=await UserModel.findById(userId).populate({path: "posts",options: {sort:{createdAt:-1}}})
    res.json
  }
    catch(error){
      return next(new HttpError(error)) 
    }
  }

  module.exports={createPost,getPost,getPosts,updatePost,deletePost,likeDislikePost,getUserPosts} 