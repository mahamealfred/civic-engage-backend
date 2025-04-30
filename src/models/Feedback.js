const mongoose = require('mongoose');


const FeedbackSchema = new mongoose.Schema({
  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Likely a staff or admin user
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
