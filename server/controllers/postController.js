const Post = require('../models/postModel');

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);// Takes data sent in request and makes a Post
    await newPost.save();// Saves it to the database
    res.status(201).json(newPost);// Sends back the saved post
  } catch (err) {
    res.status(500).json({ error: err.message });// Handles errors
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });// Fetches all posts, latest first
    res.json(posts); // Sends them back as JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
    try {
      const { id } = req.params; // Extract the post ID from the request parameters
      const deletedPost = await Post.findByIdAndDelete(id); // Find and delete the post by ID
  
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' }); // Handle case where post doesn't exist
      }
  
      res.json({ message: 'Post deleted successfully', post: deletedPost }); // Respond with success message
    } catch (err) {
      res.status(500).json({ error: err.message }); // Handle errors
    }
  };
  
  exports.updatePost = async (req, res) => {
    try {
      const { id } = req.params; // Extract the post ID from the request parameters
      const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Ensure the update respects the schema validation
      });
  
      if (!updatedPost) {
        return res.status(404).json({ error: 'Post not found' }); // Handle case where post doesn't exist
      }
  
      res.json({ message: 'Post updated successfully', post: updatedPost }); // Respond with success message
    } catch (err) {
      res.status(500).json({ error: err.message }); // Handle errors
    }
  };