const express = require("express");
const router = require("express").Router()

const {registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser, changeUserAvatar} = require('../controllers/userControllers')
const{createPost,getPost,getPosts,updatePost,deletePost, getUserPosts, likeDislikePost}=require('../controllers/postController') 
const { sharePost, getPostShares } = require("../controllers/shareController");
const { createComment, getPostComments, deleteComment } = require("../controllers/commentController")
const {createMessage, getMessages, getConversation, getConversations} = require("../controllers/messageController")
//MESSAGE ROUTES 

// const { createMessage } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware")

//USER ROUTES
router.post('/users/register', registerUser)               //http://localhost:5000/api/users/register
router.post('/users/login', loginUser)                    // http://localhost:5000/api//users/login
router.get('/users/:id', authMiddleware, getUser)
router.get('/users', authMiddleware, getUsers)                                         
router.patch('/users/:id', authMiddleware, editUser)
router.get('/users/:id/follow-unfollow', authMiddleware, followUnfollowUser)
router.post('/users/avatar', authMiddleware, changeUserAvatar)
router.get('/users/:id/posts', authMiddleware, getUserPosts)


//POST ROUTES
router.post('/posts',authMiddleware,createPost)
router.get('/posts/:id',getPost)
router.get('/posts',authMiddleware,getPosts)
router.patch('/posts/:id',authMiddleware,updatePost)
router.delete('/posts/:id',authMiddleware,deletePost)
router.get('/posts/:id/like',authMiddleware,likeDislikePost)

// Share a post
router.post("/:postId/share", sharePost);

// Get all shares for a post
router.get("/:postId/shares", getPostShares);



//comment
router.post('/comments/:postId',authMiddleware, createComment)
router.get('/comments/:postId',authMiddleware, getPostComments)
router.delete('/comments/:commentId',authMiddleware, deleteComment)

//Message - conversation
router.post('/messages/:receiverId', authMiddleware, createMessage)
router.get('/messages/:receiverId', authMiddleware, getMessages)
router.get('/conversations', authMiddleware, getConversations)

module.exports = router;