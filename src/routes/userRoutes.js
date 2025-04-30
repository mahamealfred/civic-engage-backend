const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
  const { firstName,lastName, email, password } = req.body;
  try {
    const found= await User.findOne({ email });
    if (found) return res.status(404).json({ error: 'This email is already in use' });
    const user = new User({ 
      firstName,
      lastName,
      email,
     password
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/new-staff', async (req, res) => {
  const { firstName,lastName, email,role } = req.body;
  try {
    const found= await User.findOne({ email });
    if (found) return res.status(404).json({ error: 'This email is already in use' });
    const user = new User({ 
      firstName,
      lastName,
      email,
      role,
      password:"password"
    });
    await user.save();
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ 
      email:email,
      firstName:user.firstName,
      lastName:user.lastName,
      id:user._id,
      role:user.role,
      token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (Admin)
router.get('/all', async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a user (Admin)
  router.delete('/:id', async (req, res) => {
    try {
      const user = await User.findOne({ _id:req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
