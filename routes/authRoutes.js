const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register
// Register
// In your registration route
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    console.log("Incoming Registration Request:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();

    // Generate token with user ID
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    // Return both token and user ID in response
    res.status(201).json({ 
      message: "User registered successfully",
      token,
      userId: newUser._id 
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Return both token and user ID in response
    res.json({ 
      token, 
      userId: user._id,
      user: { 
        name: user.name, 
        email: user.email, 
        phone: user.phone 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// In your backend routes
router.get('/:userId', async (req, res) => {
  try {
    // Verify the token first
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Make sure the requested userId matches the token's userId
    if (decoded.id !== req.params.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
