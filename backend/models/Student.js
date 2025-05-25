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
  address: {
    block: {
      type: String,
      default: ''
    },
    street: {
      type: String,
      default: ''
    },
    barangay: {
      type: String,
      default: ''
    },
    municipality: {
      type: String,
      default: ''
    },
    province: {
      type: String,
      default: ''
    }
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
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    },
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    location: {
      type: String
    },
    feedback: {
      type: String
    },
    rejectionReason: {
      type: String
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'graduated'],
    default: 'inactive'
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

// Virtual for fullName
StudentSchema.virtual('fullName').get(function() {
  if (this.user) {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  if (this.pendingRegistration) {
    return `${this.pendingRegistration.firstName} ${this.pendingRegistration.lastName}`;
  }
  return 'Unknown Student';
});

// Virtual for full address
StudentSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  
  const { block, street, barangay, municipality, province } = this.address;
  const parts = [];
  
  if (block) parts.push(block);
  if (street) parts.push(street);
  if (barangay) parts.push(barangay);
  if (municipality) parts.push(municipality);
  if (province) parts.push(province);
  
  return parts.join(', ');
});

module.exports = mongoose.model('Student', StudentSchema); 