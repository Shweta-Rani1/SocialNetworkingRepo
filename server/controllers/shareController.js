const ShareModel = require("../models/shareModel");
const PostModel = require("../models/postModel");
const HttpError = require("../models/errorModel");

// Share a post
exports.sharePost = async (req, res, next) => {
  try {
    const { postId } = req.params; // Post ID
    const userId = req.body.userId; // User ID from the request body

    const post = await PostModel.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    // Check if the user has already shared the post
    const existingShare = await ShareModel.findOne({ post: postId, user: userId });
    if (existingShare) {
      return next(new HttpError("You have already shared this post", 400));
    }

    // Create a new share
    const newShare = new ShareModel({ post: postId, user: userId });
    await newShare.save();

    res.status(201).json({ message: "Post shared successfully", share: newShare });
  } catch (err) {
    return next(new HttpError("Sharing the post failed, please try again later", 500));
  }
};

// Get all shares for a post
exports.getPostShares = async (req, res, next) => {
  try {
    const { postId } = req.params; // Post ID

    const shares = await ShareModel.find({ post: postId }).populate("user", "fullname profilePhoto");
    res.json({ shares });
  } catch (err) {
    return next(new HttpError("Fetching shares failed, please try again later", 500));
  }
};