const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [
    {
      questionText: { type: String, required: true },
      options: [String],
    },
  ],
  responses: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answers: [String],
      submittedAt: { type: Date, default: Date.now },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Survey', SurveySchema);
