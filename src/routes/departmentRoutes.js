const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all categories
router.get('/', async (req, res) => {
  try {
   const department = await Department.find()
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new department
router.post('/new-department', async (req, res) => {
  const { name, description } = req.body;
  const newDepartment= new Department({
    name,
    description
  });
  
  try {
    const savedDepartment = await newDepartment.save();
    res.status(201).json({
      status:201,
      message:"The sent successfully",
      data:savedDepartment
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete a department
router.delete('/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: 'Department deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
