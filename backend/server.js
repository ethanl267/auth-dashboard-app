const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const loginHistory = []; 
const activities = []; // Array to store activities
const nutrition = [];  // Array to store nutrition info
const goals = [];      // Array to store goals

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  res.json({ message: 'User registered successfully!' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ username }, 'secretkey');

    // Save the login event with timestamp
    loginHistory.push({ username, timestamp: new Date().toISOString() });

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Endpoint to get login history
app.get('/login-history', (req, res) => {
  res.json(loginHistory);
});

// Endpoint to get activities
app.get('/activities', (req, res) => {
  res.json(activities);
});

// Endpoint to get nutrition
app.get('/nutrition', (req, res) => {
  res.json(nutrition);
});

// Endpoint to get goals
app.get('/goals', (req, res) => {
  res.json(goals);
});

// Endpoint to add a new activity
app.post('/activities', (req, res) => {
  const { name, duration, caloriesBurned } = req.body;
  activities.push({ id: activities.length + 1, name, duration, caloriesBurned });
  res.json({ message: 'Activity added successfully!' });
});

// Endpoint to add a new nutrition entry
app.post('/nutrition', (req, res) => {
  const { meal, calories } = req.body;
  nutrition.push({ id: nutrition.length + 1, meal, calories });
  res.json({ message: 'Nutrition entry added successfully!' });
});

// Endpoint to add a new goal
app.post('/goals', (req, res) => {
  const { goal, status } = req.body;
  goals.push({ id: goals.length + 1, goal, status });
  res.json({ message: 'Goal added successfully!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));

