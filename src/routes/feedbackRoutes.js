const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Issue = require('../models/Issue');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('issue', 'name description'); // Populate department with name and description

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get feedback by creator ID
router.get('/issue/:issueId', async (req, res) => {
  try {
    const {issueId } = req.params;
    const feedbacks = await Feedback.find({ issue: issueId })
      .populate('issue', 'name description'); // Populate issue with name and description
      
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Create a new feedback
router.post('/new-feedback',authMiddleware, async (req, res) => {
  const { issueId, content,status } = req.body;
  const userId = req.user._id

  try {
     // Validate issue existence
     const issue = await Issue.findById(issueId);
     if (!issue) {
       return res.status(404).json({ message: 'Issue not found' });
     }
     const newFeedback = new Feedback({
      issue,
      author:userId,
      content
    });
    
    const savedFeedback = await newFeedback.save();
     // Push feedback reference to the issue
     issue.feedbacks.push(savedFeedback._id);
     issue.status=status
     await issue.save();
    res.status(201).json({
      status:201,
      message:"The sent successfully",
      data:savedFeedback
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a feedback
router.put('/:id', async (req, res) => {
  try {
    const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a feedback
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;
