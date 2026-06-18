const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc  Register a new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });
    if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' });
    if (!password || password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(409).json({ error: 'An account with this email already exists.' });

    const user = await User.create({ name: name.trim(), email: email.trim(), password });

    const safeUser = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.status(201).json({ token: generateToken(user._id), user: safeUser });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) return res.status(400).json({ error: 'Email is required.' });
    if (!password) return res.status(400).json({ error: 'Password is required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });

    const safeUser = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.json({ token: generateToken(user._id), user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

// @desc  Update user profile (name)
// @route PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const safeUser = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Server error during profile update.' });
  }
};

module.exports = { register, login, updateProfile };
