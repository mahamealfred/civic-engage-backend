const express = require('express');
const Survey = require('../models/Survey');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a Survey
router.post('/create',authMiddleware, async (req, res) => {
  const { title, description, questions } = req.body;
  const createdBy=req.user._id
  try {
    const newSurvey = new Survey({ title, description, questions, createdBy });
    await newSurvey.save();
    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All Surveys
router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.find().populate('createdBy', 'name');
    res.status(200).json(surveys);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit a Survey Response
router.post('/:id/response', async (req, res) => {
  const { userId, answers } = req.body;
  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });

    survey.responses.push({ userId, answers });
    await survey.save();
    res.status(200).json({ message: 'Response submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Survey Analytics (Admin)
router.get('/:id/analytics', async (req, res) => {
    try {
      const survey = await Survey.findById(req.params.id).populate('responses.userId', 'name');
      if (!survey) return res.status(404).json({ error: 'Survey not found' });
  
      const analytics = survey.responses.reduce((acc, response) => {
        response.answers.forEach((answer, index) => {
          if (!acc[index]) acc[index] = {};
          if (!acc[index][answer]) acc[index][answer] = 0;
          acc[index][answer]++;
        });
        return acc;
      }, []);
  
      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
