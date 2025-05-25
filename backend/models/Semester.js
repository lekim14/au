const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  title: {
    type: String, 
  },
  description: {
    type: String
  },
  schoolYear: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Semester', SemesterSchema); 