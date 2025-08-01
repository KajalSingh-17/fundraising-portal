const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function to read database
const readDatabase = () => {
  try {
    const dataPath = path.join(__dirname, 'data', 'database.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { interns: [], availableRewards: [] };
  }
};

// Routes

// Get all interns for leaderboard
app.get('/api/interns', (req, res) => {
  try {
    const database = readDatabase();
    const sortedInterns = database.interns.sort((a, b) => b.totalDonations - a.totalDonations);
    res.json({
      success: true,
      data: sortedInterns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interns data',
      error: error.message
    });
  }
});

// Get specific intern by ID
app.get('/api/intern/:id', (req, res) => {
  try {
    const database = readDatabase();
    const internId = parseInt(req.params.id);
    const intern = database.interns.find(i => i.id === internId);
    
    if (!intern) {
      return res.status(404).json({
        success: false,
        message: 'Intern not found'
      });
    }

    res.json({
      success: true,
      data: intern
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching intern data',
      error: error.message
    });
  }
});

// Login endpoint (dummy - just returns intern data)
app.post('/api/login', (req, res) => {
  try {
    const { email } = req.body;
    const database = readDatabase();
    const intern = database.interns.find(i => i.email === email);
    
    if (!intern) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: intern
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

// Sign up endpoint (dummy - just returns success)
app.post('/api/signup', (req, res) => {
  try {
    const { name, email } = req.body;
    
    // In a real app, you'd create a new user here
    // For now, just return success
    res.json({
      success: true,
      message: 'Account created successfully! You can now login with your email.',
      data: {
        name,
        email,
        referralCode: `${name.toLowerCase().replace(/\s+/g, '')}2025`,
        totalDonations: 0,
        rewards: []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during signup',
      error: error.message
    });
  }
});

// Get available rewards
app.get('/api/rewards', (req, res) => {
  try {
    const database = readDatabase();
    res.json({
      success: true,
      data: database.availableRewards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching rewards data',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;