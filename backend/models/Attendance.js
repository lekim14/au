const mongoose = require('mongoose');

// Schema for individual attendance records
const AttendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  present: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
});

// Main attendance session schema
const AttendanceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  topic: {
    type: String,
    trim: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  adviser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  records: [AttendanceRecordSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound indices for querying efficiency
AttendanceSchema.index({ class: 1, date: 1 });
AttendanceSchema.index({ adviser: 1 });

// Pre-save middleware to update the updatedAt field
AttendanceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema); 