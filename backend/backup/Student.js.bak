const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      // Only required if this is an approved student
      return this.approvalStatus === 'approved';
    }
  },
  pendingRegistration: {
    firstName: {
      type: String,
      required: function() {
        return this.approvalStatus === 'pending';
      }
    },
    middleName: {
      type: String
    },
    lastName: {
      type: String,
      required: function() {
        return this.approvalStatus === 'pending';
      }
    },
    nameExtension: {
      type: String,
      default: 'N/A'
    },
    idNumber: {
      type: String,
      required: function() {
        return this.approvalStatus === 'pending';
      }
    },
    email: {
      type: String,
      required: function() {
        return this.approvalStatus === 'pending';
      }
    },
    password: {
      type: String,
      required: function() {
        return this.approvalStatus === 'pending';
      }
    }
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: false
  },
  classDetails: {
    yearLevel: {
      type: String,
      required: false
    },
    section: {
      type: String,
      required: false
    },
    major: {
      type: String,
      required: false
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  major: {
    type: String,
    enum: ['Business Informatics', 'System Development', 'Digital Arts', 'Computer Security'],
    required: true
  },
  odysseyPlanCompleted: {
    type: Boolean,
    default: false
  },
  srmSurveyCompleted: {
    type: Boolean,
    default: false
  },
  consultations: [{
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String
    },
    adviser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvalNotes: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Student', StudentSchema); 