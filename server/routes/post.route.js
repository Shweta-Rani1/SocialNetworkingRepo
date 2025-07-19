const express = require('express');
const router = express.Router();
var post= require('../controllers/post.controller');

// POST /api/posts
router.post('/create', post.createPost);

// GET /api/posts
router.get('/getAll', post.getPosts);
// DELETE /api/posts/:id
router.delete('/delete/:id', post.deletePost);


//update /api/posts/:id
router.put('/update/:id', post.updatePost);
module.exports = router;