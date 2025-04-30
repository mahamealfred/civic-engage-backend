const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  // contactEmail: {
  //   type: String,
  //   trim: true,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = Department;
