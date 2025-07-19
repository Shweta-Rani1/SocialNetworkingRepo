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

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/socialDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => console.error('MongoDB connection error:', err));
