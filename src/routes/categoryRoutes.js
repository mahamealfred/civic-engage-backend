const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all categories
router.get('/', async (req, res) => {
  try {
   const category = await Category.find()
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new category
router.post('/new-category', async (req, res) => {
  const { name, description } = req.body;
  const newCategory= new Category({
    name,
    description
  });
  
  try {
    const savedCategory = await newCategory.save();
    res.status(201).json({
      status:201,
      message:"The sent successfully",
      data:savedCategory
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
