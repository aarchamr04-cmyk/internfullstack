const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────
app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/tasks', require('./Routes/taskRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'TaskFlow API is running ✅' }));

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Connect to MongoDB + Start Server ───────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
