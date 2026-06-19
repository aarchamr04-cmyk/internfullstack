const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // If no origin (e.g. server-to-server request) or allowed origin, let it pass
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : [];
    if (allowedOrigins.includes(origin) || process.env.CLIENT_URL === '*') {
      callback(null, true);
    } else {
      // In development or if not strictly set, allow reflection for credentials
      callback(null, true); 
    }
  },
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

// ── Start Server & Connect to MongoDB ─────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ FATAL: MONGODB_URI environment variable is missing!');
  } else {
    mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => {
        console.log('✅ MongoDB connected successfully');
      })
      .catch((err) => {
        console.error('❌ MongoDB connection failed. Please check your Render Environment Variables and Atlas IP Whitelist.');
        console.error(err.message);
      });
  }
});
