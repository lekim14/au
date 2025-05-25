const mongoose = require('mongoose');

const surveyDataSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  screenshotUrl: {
    type: String,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  }
}, { timestamps: true });

// This will create a 'surveydata' collection in the MongoDB database
const SurveyData = mongoose.model('SurveyData', surveyDataSchema);

module.exports = SurveyData; 