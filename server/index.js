const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Dummy data for demonstration
const internData = {
  users: [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@company.com",
      referralCode: "alexj2025",
      totalDonations: 2450.75,
      rewards: [
        { name: "Bronze Badge", unlocked: true, description: "Raise $1000+" },
        { name: "Silver Badge", unlocked: true, description: "Raise $2000+" },
        { name: "Gold Badge", unlocked: false, description: "Raise $5000+" },
        { name: "Platinum Badge", unlocked: false, description: "Raise $10000+" }
      ]
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      referralCode: "sarahc2025",
      totalDonations: 3820.50,
      rewards: [
        { name: "Bronze Badge", unlocked: true, description: "Raise $1000+" },
        { name: "Silver Badge", unlocked: true, description: "Raise $2000+" },
        { name: "Gold Badge", unlocked: false, description: "Raise $5000+" },
        { name: "Platinum Badge", unlocked: false, description: "Raise $10000+" }
      ]
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      email: "michael.rodriguez@company.com",
      referralCode: "michaelr2025",
      totalDonations: 1875.25,
      rewards: [
        { name: "Bronze Badge", unlocked: true, description: "Raise $1000+" },
        { name: "Silver Badge", unlocked: false, description: "Raise $2000+" },
        { name: "Gold Badge", unlocked: false, description: "Raise $5000+" },
        { name: "Platinum Badge", unlocked: false, description: "Raise $10000+" }
      ]
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      referralCode: "emilyd2025",
      totalDonations: 5240.90,
      rewards: [
        { name: "Bronze Badge", unlocked: true, description: "Raise $1000+" },
        { name: "Silver Badge", unlocked: true, description: "Raise $2000+" },
        { name: "Gold Badge", unlocked: true, description: "Raise $5000+" },
        { name: "Platinum Badge", unlocked: false, description: "Raise $10000+" }
      ]
    }
  ]
};

// API Routes

// Login endpoint (dummy authentication)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email (dummy validation)
  const user = internData.users.find(u => u.email === email);
  
  if (user && password === 'password123') {
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Register endpoint (dummy)
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // Check if user already exists
  const existingUser = internData.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }
  
  // Create new user (in real app, this would be saved to database)
  const newUser = {
    id: internData.users.length + 1,
    name,
    email,
    referralCode: `${name.toLowerCase().replace(' ', '')}2025`,
    totalDonations: 0,
    rewards: [
      { name: "Bronze Badge", unlocked: false, description: "Raise $1000+" },
      { name: "Silver Badge", unlocked: false, description: "Raise $2000+" },
      { name: "Gold Badge", unlocked: false, description: "Raise $5000+" },
      { name: "Platinum Badge", unlocked: false, description: "Raise $10000+" }
    ]
  };
  
  internData.users.push(newUser);
  
  res.json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

// Get user data
app.get('/api/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = internData.users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    user
  });
});

// Get leaderboard data
app.get('/api/leaderboard', (req, res) => {
  const sortedUsers = internData.users
    .sort((a, b) => b.totalDonations - a.totalDonations)
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      totalDonations: user.totalDonations,
      referralCode: user.referralCode
    }));
  
  res.json({
    success: true,
    leaderboard: sortedUsers
  });
});

// Serve the client files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dashboard.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/leaderboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Intern Dashboard server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});