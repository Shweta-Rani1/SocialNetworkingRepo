//friendController


const Friend = require('../models/friend.model');
//const User = require('../models/userModel'); // Assuming you have a User model for user profiles

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;

    // Check if a request already exists
    const existingRequest = await Friend.findOne({ user_id, friend_id });
    if (existingRequest) {
      return res.status(400).json({ error: 'Friend request already exists' });
    }

    const friendRequest = new Friend({ user_id, friend_id });
    await friendRequest.save();

    res.status(201).json({ message: 'Friend request sent', friendRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept or reject a friend request
exports.manageFriendRequest = async (req, res) => {
  try {
    const { id } = req.params; // Friend request ID
    const { status } = req.body; // New status: 'accepted' or 'rejected'

    // Update the friend request status
    const updatedRequest = await Friend.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    res.json({ message: `Friend request ${status}`, updatedRequest });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all friends of a user
exports.getFriends = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch all accepted friends
    const friends = await Friend.find({ user_id, status: 'accepted' }).populate('friend_id', 'name email bio');

    res.json({ message: 'Friends fetched successfully', friends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove a friend
exports.removeFriend = async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;

    const deletedFriend = await Friend.findOneAndDelete({ user_id, friend_id, status: 'accepted' });

    if (!deletedFriend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    res.json({ message: 'Friend removed successfully', deletedFriend });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get mutual friends
exports.getMutualFriends = async (req, res) => {
  try {
    const { user_id, friend_id } = req.params;

    // Find friends of the user
    const userFriends = await Friend.find({ user_id, status: 'accepted' }).select('friend_id');
    const userFriendIds = userFriends.map(friend => friend.friend_id.toString());

    // Find friends of the other user
    const friendFriends = await Friend.find({ user_id: friend_id, status: 'accepted' }).select('friend_id');
    const friendFriendIds = friendFriends.map(friend => friend.friend_id.toString());

    // Find mutual friends
    const mutualFriendIds = userFriendIds.filter(id => friendFriendIds.includes(id));
    const mutualFriends = await User.find({ _id: { $in: mutualFriendIds } });

    res.json({ message: 'Mutual friends fetched successfully', mutualFriends });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};