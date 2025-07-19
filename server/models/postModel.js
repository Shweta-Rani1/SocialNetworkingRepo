const {Schema, model} = require('mongoose');

const postSchema = new Schema({
  creator:{type:Schema.Types.ObjectId,ref:'User'},//Reference to User model
  body:{type:String,required:true},//Text content of the post
  image:{type:String,required:true},
 // video:{type:String,required:true},
  likes:[{type:Schema.Types.ObjectId,ref:'User'}],//Array of User IDs who liked the pos
  comments:[{type:Schema.Types.ObjectId,ref:'Comment'}],

})
module.exports = model('Post',postSchema);
// This code defines a Mongoose schema for a social media post, including fields for the creator
