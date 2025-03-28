const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  yearLevel: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  major: {
    type: String,
    enum: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'],
    required: true
  },
  daySchedule: {
    type: String,
    required: true
  },
  timeSchedule: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },
  sspSubject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
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

module.exports = mongoose.model('Class', ClassSchema); 