const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));

app.get('/', (req, res) => {
  res.send('Train Tracking API is running...');
});


// Database Connection with Retry Logic
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traintrack';

const connectWithRetry = () => {
  console.log('⏳ Attempting to connect to MongoDB...');
  mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 5000, // Wait 5s before timing out
  })
    .then(() => {
      console.log('✅ MongoDB Connected Successfully');
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('🔄 MongoDB connection failed. Operations will be limited. Retrying in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

// Start the server immediately
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📢 Note: Auth and Data persistence will be unavailable until MongoDB is connected.');
  connectWithRetry();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});
