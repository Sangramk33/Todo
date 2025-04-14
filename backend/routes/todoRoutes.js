const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const winston = require('winston');

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

// Get all todos
router.get('/', async (req, res) => {
  try {
    logger.info('Fetching all todos');
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    logger.error('Error fetching todos:', err);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// Create a todo
router.post('/', async (req, res) => {
  try {
    logger.info('Creating new todo:', req.body.text);
    const todo = new Todo({
      text: req.body.text,
    });
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    logger.error('Error creating todo:', err);
    res.status(400).json({ message: 'Failed to create todo' });
  }
});

// Update a todo (toggle completion)
router.patch('/:id', async (req, res) => {
  try {
    logger.info(`Toggling todo with ID: ${req.params.id}`);
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      logger.warn(`Todo not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Todo not found' });
    }
    todo.completed = !todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    logger.error('Error updating todo:', err);
    res.status(400).json({ message: 'Failed to update todo' });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    logger.info(`Deleting todo with ID: ${req.params.id}`);
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      logger.warn(`Todo not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Todo not found' });
    } 
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    logger.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

module.exports = router;