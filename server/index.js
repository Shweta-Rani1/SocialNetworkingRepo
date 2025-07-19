const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/post.route');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/post', postRoutes);


