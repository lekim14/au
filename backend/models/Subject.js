const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 17
  },
  title: {
    type: String,
    required: true,
    trim: true
  }
});

const SubjectSchema = new mongoose.Schema({
  sspCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  yearLevel: {
    type: String,
    enum: ['2nd', '3rd', '4th'],
    required: true
  },
  sessions: {
    type: [SessionSchema],
    validate: [
      {
        validator: function(sessions) {
          return sessions.length <= 17;
        },
        message: 'Maximum 17 sessions allowed per subject'
      }
    ]
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

module.exports = mongoose.model('Subject', SubjectSchema); 