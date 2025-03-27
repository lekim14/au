const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be imported here
const authRoutes = require('./routes/auth');
const adviserRoutes = require('./routes/advisers');
const classRoutes = require('./routes/classes');
const subjectRoutes = require('./routes/subjects');
const studentRoutes = require('./routes/students');
const announcementRoutes = require('./routes/announcements');
const userRoutes = require('./routes/users');
const sessionRoutes = require('./routes/sessions');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/advisers', adviserRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Health check and diagnostic route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  let dbStatus;
  
  switch (dbState) {
    case 0:
      dbStatus = 'disconnected';
      break;
    case 1:
      dbStatus = 'connected';
      break;
    case 2:
      dbStatus = 'connecting';
      break;
    case 3:
      dbStatus = 'disconnecting';
      break;
    default:
      dbStatus = 'unknown';
  }
  
  res.json({
    status: 'ok',
    timestamp: new Date(),
    database: {
      status: dbStatus,
      uri: process.env.MONGODB_URI.replace(/mongodb:\/\/(.*)@/, 'mongodb://****:****@') // Hide credentials
    },
    routes: {
      auth: '/api/auth',
      advisers: '/api/advisers',
      classes: '/api/classes',
      subjects: '/api/subjects',
      students: '/api/students',
      announcements: '/api/announcements',
      users: '/api/users',
      sessions: '/api/sessions'
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.send('SSP Management System API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 