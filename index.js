const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve the HTML and CSS files

// Path to users data
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// Ensure users.json file exists and load users
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

let users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

// Signup API
app.post('/api/signup', (req, res) => {
  const { username, password } = req.body;
  
  // Check if the user already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  // Add new user
  const newUser = { username, password };
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  res.status(201).json({ success: true, message: 'User registered successfully' });
});

// Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists and credentials match
  const user = users.find(user => user.username === username && user.password === password);
  
  if (user) {
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
