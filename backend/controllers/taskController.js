const Task = require('../models/Task');

// @desc  Get all tasks for logged-in user
// @route GET /api/tasks
// @access Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    const formatted = tasks.map(t => ({
      id: t._id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status: t.status,
      dueDate: t.dueDate,
      createdAt: t.createdAt,
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Server error fetching tasks.' });
  }
};

// @desc  Create a task
// @route POST /api/tasks
// @access Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required.' });

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      status: status || 'pending',
      dueDate: dueDate || null,
    });

    res.status(201).json({
      id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
    });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Server error creating task.' });
  }
};

// @desc  Update a task
// @route PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found.' });

    const { title, description, priority, status, dueDate } = req.body;
    task.title = title?.trim() ?? task.title;
    task.description = description?.trim() ?? task.description;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();

    res.json({
      id: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
    });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Server error updating task.' });
  }
};

// @desc  Delete a task
// @route DELETE /api/tasks/:id
// @access Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Server error deleting task.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
