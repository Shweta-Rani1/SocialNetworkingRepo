const CommentModel = require("../models/commentModel")
// httperror model
const PostModel = require("../models/postModel")
const HttpError = require("../models/errorModel")
const UserModel = require("../models/userModel")
// user model


//create comment
// POST : api/comments/:postId
const createComment = async (req, res, next) => {
    try{
        
        const {postId} = req.params;
    const {comment} = req.body;
      if(!comment) {
        return next(new HttpError("Please write a comment", 422)); 
      }
      //get comment creator from db
      const commentCreator = await UserModel.findById(req.user.id);
      const newComment = await CommentModel.create({creator: {creatorId: req.user.id, creatorName: commentCreator?.fullname, creatorPhoto: commentCreator?.profilePhoto}, postId, comment});
      await PostModel.findByIdAndUpdate(postId, {$push: {comments: newComment?._id}}, {new: true});
      res.json(newComment)
    } catch(error){
        return next(new HttpError)
    }
}

//GET comment
// GET : api/comments/:postId
const getPostComments = async (req, res, next) => {
    try{
        const {postId} = req.params;
        const comments = await PostModel.findById(postId).populate({path: "comments", options: {sort: {createdAt: -1}}}) 
        res.json(comments)
    } catch(error){
        return next(new HttpError)
    }
}


//Delete comment
//DELETE : api/comments/:postId
const deleteComment = async (req, res, next) => {
    try{
        const {commentId} = req.params;
        //get the comment from db
        const comment = await CommentModel.findById(commentId);
        const commentCreator = await UserModel.findById(comment?.creator?.commentId)
           //check if the creator is th eone performing the deletion
           if(commentCreator?._id != req.user.id) {
            return next(new HttpError("You are not authorized to delete this comment", 403));
    }
    //remove comment id from post comments array
    await PostModel.findByIdAndUpdate(comment?.postId, {$pull: {comments: commentId}});
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    res.json(deletedComment);
 } catch(error){
        return next(new HttpError)
    }
}



module.exports = {createComment, getPostComments, deleteComment}