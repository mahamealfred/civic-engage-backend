const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all issues
router.get('/', async (req, res) => {
  try {
   const issues = await Issue.find().populate('creator', 'firstName lastName').populate('comments.userId', 'firstName lastName');
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new issue
router.post('/',authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id
  const newIssue = new Issue({
    title,
    description,
    creator:userId,
  });
  
  try {
    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an issue
router.put('/:id', async (req, res) => {
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedIssue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//update issue status
router.put('/:id/status',authMiddleware,async (req,res)=>{
  const { id } = req.params;
    const { status } = req.body;

    try {
        const issue = await Issue.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
        if (!issue) return res.status(404).json({ msg: 'Issue not found' });
        res.json(issue);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
})

// Delete an issue
router.delete('/:id', async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upvote an issue
router.post('/:id/upvote', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue.upvotes.includes(req.body.userId)) {
      issue.upvotes.push(req.body.userId);
      issue.downvotes.pull(req.body.userId); // Remove downvote if it exists
    }
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Downvote an issue
router.post('/:id/downvote', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue.downvotes.includes(req.body.userId)) {
      issue.downvotes.push(req.body.userId);
      issue.upvotes.pull(req.body.userId); // Remove upvote if it exists
    }
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a comment to an issue
router.post('/:id/comment', async (req, res) => {
  const { userId, text } = req.body;
  
  try {
    const issue = await Issue.findById(req.params.id);
    issue.comments.push({ userId, text });
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
