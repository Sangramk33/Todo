const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const winston = require('winston');
require('dotenv').config();

const app = express();
 
// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
console.log('CORS middleware configured for http://localhost:5173');

// Parse JSON bodies
app.use(express.json());
console.log('JSON parsing middleware enabled');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Routes
app.use('/api/todos', todoRoutes);
console.log('Todo routes mounted at /api/todos');

// Error handling middleware
app.use((err, req, res, next) => {
  console.log('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});