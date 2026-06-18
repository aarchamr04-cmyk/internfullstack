const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authmiddleware');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

// All routes require authentication
router.use(authMiddleware);

// GET  /api/tasks
router.get('/', getTasks);

// POST /api/tasks
router.post('/', createTask);

// PUT  /api/tasks/:id
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

module.exports = router;
