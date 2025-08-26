const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('creator', 'firstName lastName') // Populate creator with firstName and lastName
     // .populate('comments.userId', 'firstName lastName') // Populate comments' userId with firstName and lastName
      .populate('category', 'name description') // Populate category with name and description
      .populate('department', 'name description') // Populate department with name and description
      .populate({
        path: 'feedbacks', // Assuming 'feedbacks' is an array of Feedback IDs in the Issue schema
        populate: {
          path: 'author', // Populate author within feedback
          select: 'firstName lastName', // Include author details
        },
      });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get issues by creator ID
router.get('/creator/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;
    const issues = await Issue.find({ creator: creatorId })
      .populate('creator', 'firstName lastName')
      //.populate('comments.userId', 'firstName lastName')
      .populate('category', 'name description')
      .populate('department', 'name description')
      .populate({
        path: 'feedbacks',
        populate: {
          path: 'author',
          select: 'firstName lastName',
        },
      });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Create a new issue
router.post('/',authMiddleware, async (req, res) => {
  const { title, description,category,department } = req.body;
  const userId = req.user._id
  const newIssue = new Issue({
    title,
    description,
    creator:userId,
    department,
    category
  });
  
  try {
    const savedIssue = await newIssue.save();
    res.status(201).json({
      status:201,
      message:"The sent successfully",
      data:savedIssue
    });
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


// Assign an issue to a user
router.post('/assign/:issueId/:userId', async (req, res) => {
  try {
    const { issueId, userId } = req.params;

    // Check if the issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ status: 404, message: 'Issue not found' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    // Assign the issue to the user
    // if (!user.assignedIssues.includes(issueId)) {
    //   user.assignedIssues.push(issueId);
    //   await user.save();
    // }

    // Update the issue to assign the user
   // Assign the user to the issue
   console.log("issue:",issue)
   issue.assignedStaff = userId;
    issue.status = 'open'
   await issue.save();

    return res.status(200).json({
      status: 200,
      message: "Issue assigned successfully",
      data: {
        user,
        issue
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.get('/assigned-to/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user exists (optional but recommended)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }

    // Find all issues assigned to this user
    const issues = await Issue.find({ assignedStaff: userId })
    .populate('creator', 'firstName lastName') // Populate creator with firstName and lastName
    // .populate('comments.userId', 'firstName lastName') // Populate comments' userId with firstName and lastName
     .populate('category', 'name description') // Populate category with name and description
     .populate('department', 'name description') // Populate department with name and description
     .populate({
       path: 'feedbacks', // Assuming 'feedbacks' is an array of Feedback IDs in the Issue schema
       populate: {
         path: 'author', // Populate author within feedback
         select: 'firstName lastName', // Include author details
       },
     });

   res.json(issues);

  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

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
