const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  nameExtension: {
    type: String,
    trim: true,
    default: 'N/A'
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\d{2}-\d{4}-\d{6}$/
  },
  salutation: {
    type: String,
    required: function() {
      return this.role === 'adviser';
    },
    enum: {
      values: ['Mr.', 'Mrs.', 'Ms.'],
      message: '{VALUE} is not a valid salutation. Only Mr., Mrs., or Ms. are allowed.'
    },
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  passwordChangeRequired: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['admin', 'adviser', 'student'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 