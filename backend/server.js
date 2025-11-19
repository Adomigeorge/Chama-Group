const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log('=== INCOMING REQUEST ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  console.log('=====================');
  next();
});

app.use('/api/auth', (req, res, next) => {
  console.log('=== AUTH ROUTE HIT ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('=====================');
  next();
});

app.use('/api/users', (req, res, next) => {
  console.log('=== USERS ROUTE HIT ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Body:', req.body);
  console.log('=====================');
  next();
});

// Import database and models - USE LOWERCASE
const { sequelize, user } = require('./models');

// Import routes
const userRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const contributionRoutes = require('./routes/contributions.routes');
const loanRoutes = require('./routes/loans.routes');
const groupsRoutes = require('./routes/groups.routes');
const membersRoutes = require('./routes/members.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Import cleanup service
const { startCleanupScheduler } = require('./services/cleanup.service');

app.post('/api/test-register', async (req, res) => {
  try {
    console.log('=== TEST REGISTRATION START ===');
    console.log('Request body:', req.body);
    
    if (!req.body || !req.body.name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is required' 
      });
    }
    
    const newUser = await user.create(req.body);
    
    console.log('User created with ID:', newUser.id);
    res.json({ 
      success: true, 
      message: 'User created successfully',
      userId: newUser.id
    });
    
  } catch (error) {
    console.error('Registration failed:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/groups', membersRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Database connection
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database:', process.env.DB_NAME);
    
    const userCount = await user.count();
    console.log(`Users table has ${userCount} users`);
    
  } catch (error) {
    console.error('Database error:', error.message);
  }
};

// Initialize database and start cleanup scheduler
const initializeApp = async () => {
  try {
    await syncDatabase();
    startCleanupScheduler();
    
  } catch (error) {
    console.error('💥 App initialization failed:', error);
  }
};

// Initialize the application
initializeApp();

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Chama Management API is running!',
    status: 'success'
  });
});

// Manual cleanup endpoint for testing
app.delete('/api/cleanup-expired', async (req, res) => {
  try {
    const { cleanupExpiredInvitations } = require('./controllers/memberController');
    const result = await cleanupExpiredInvitations();
    
    res.status(200).json({
      status: 'success',
      message: `Cleaned up ${result} expired invitations`,
      data: { cleaned_count: result }
    });
  } catch (error) {
    console.error('💥 Manual cleanup error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Manual cleanup failed'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Test: http://localhost:${PORT}/api/test-register`);
  console.log(`Manual cleanup: http://localhost:${PORT}/api/cleanup-expired`);
});