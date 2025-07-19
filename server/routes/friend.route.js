const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend.controller');

// Send a friend request
router.post('/send', friendController.sendFriendRequest);

// Accept or reject a friend request
router.put('/manage/:id', friendController.manageFriendRequest);

// Get all friends of a user
router.get('/list/:user_id', friendController.getFriends);

// Remove a friend
router.delete('/remove', friendController.removeFriend);

// Get mutual friends
router.get('/mutual/:user_id/:friend_id', friendController.getMutualFriends);

module.exports = router;