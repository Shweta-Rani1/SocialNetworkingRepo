const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // User sending the friend request
  friend_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // User receiving the friend request
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending' 
  }, // Status of the friend request
  requested_at: { 
    type: Date, 
    default: Date.now 
  } // Timestamp of when the friend request was sent
  
});

module.exports = mongoose.model('Friend', friendSchema);