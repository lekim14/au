const mongoose = require('mongoose');

const odysseySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  form: {
    type: Object,
    required: true
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'submitted'
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
    required: true
  }
}, { timestamps: true });

// This will create a 'surveydata' collection in the MongoDB database
const OdysseyData = mongoose.model('Odyssey', odysseySchema);

module.exports = OdysseyData; 