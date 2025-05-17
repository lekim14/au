const mongoose = require('mongoose');

const SystemOptionSchema = new mongoose.Schema({
  class: {
    yearLevels: {
      type: [String],
      default: ['2nd', '3rd', '4th']
    },
    majors: {
      type: [String],
      default: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security']
    },
    defaultSessions: {
      type: [{
        title: String,
        count: Number
      }],
      default: [
        { title: 'INTRODUCTION', count: 0 },
        { title: 'ORIENTATION', count: 0 }
      ]
    },
    sections: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        '2nd': ['South-1', 'South-2', 'South-3', 'South-4', 'South-5'],
        '3rd': ['South-1', 'South-2', 'South-3'],
        '4th': ['South-1', 'South-2']
      }
    }
  },
  subject: {
    yearLevels: {
      type: [String],
      default: ['2nd', '3rd', '4th']
    },
    schoolYear: {
      type: String,
      default: '2025 - 2026'
    },
    defaultZeroDayTitle: {
      type: String,
      default: 'INTRODUCTION'
    },
    hoursOptions: {
      type: [Number],
      default: [1, 2, 3]
    }
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

module.exports = mongoose.model('SystemOption', SystemOptionSchema);
