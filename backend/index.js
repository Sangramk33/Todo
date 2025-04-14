const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const winston = require('winston');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

logger.info('Starting backend server...');

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173', // you may want to change this for production
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Routes
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Export the serverless handler
module.exports = serverless(app);
