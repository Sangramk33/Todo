const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = require('./routes/todoRoutes');
const winston = require('winston');
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
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.Console()
  ]
});

logger.info('Starting backend server...');

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
logger.info('CORS middleware configured for http://localhost:5173');

// Parse JSON bodies
app.use(express.json());
logger.info('JSON parsing middleware enabled');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/todos', todoRoutes);
logger.info('Todo routes mounted at /api/todos');

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});