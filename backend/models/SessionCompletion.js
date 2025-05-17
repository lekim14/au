const mongoose = require('mongoose');

const SessionCompletionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sessionDay: {
    type: Number,
    required: true
  },
  sessionTitle: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  },
  semester: {
    type: String,
    enum: ['1st Semester', '2nd Semester'],
    default: '1st Semester'
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

// Create a compound index to ensure uniqueness per student-session combination
SessionCompletionSchema.index(
  { student: 1, session: 1 },
  { unique: true }
);

module.exports = mongoose.model('SessionCompletion', SessionCompletionSchema); 