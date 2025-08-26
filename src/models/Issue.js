const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'solved','rejected'], default: 'in-progress' },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }, // New category field
  department: { type: Schema.Types.ObjectId, ref: 'Department' }, // New department field
  assignedStaff: { type: Schema.Types.ObjectId, ref: 'User' }, // New department field
  feedbacks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Feedback', // Reference to Feedback
    },
  ], 

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Issue = mongoose.model('Issue', IssueSchema);

module.exports = Issue;