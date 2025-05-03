const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const Class = require('../models/Class');
const Student = require('../models/Student');

// Create admin user route (for initial setup)
router.post('/setup-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }
    
    const { firstName, middleName, lastName, nameExtension, idNumber, salutation, email, password } = req.body;
    
    // Create admin user
    const admin = new User({
      firstName,
      middleName,
      lastName,
      nameExtension: nameExtension || 'N/A',
      idNumber,
      salutation,
      email,
      password,
      role: 'admin'
    });
    
    await admin.save();
    
    res.status(201).json({ message: 'Admin user created successfully' });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'Your account is not active' });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last active
    user.lastActive = Date.now();
    await user.save();
    
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        nameExtension: user.nameExtension,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        passwordChangeRequired: user.passwordChangeRequired || false
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password request
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Reset link
    const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
    
    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'SSP Management System - Password Reset',
      text: `You are receiving this email because you (or someone else) requested a password reset. 
      Please click the following link to reset your password: ${resetUrl}`
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password completion
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Complete reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student registration
router.post('/register-student', async (req, res) => {
  try {
    const { 
      firstName, middleName, lastName, nameExtension, 
      idNumber, email, gender, contactNumber, 
      address, // This can now be an object with components
      yearLevel, section, password, major 
    } = req.body;
    
    console.log('Processing student registration for:', email);
    console.log('Class information:', { yearLevel, section, major });
    
    // Validate email domain
    if (!email.endsWith('.au@phinmaed.com')) {
      return res.status(400).json({ message: 'Email must be from phinmaed.com domain with .au format' });
    }
    
    // Check if email already exists in User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }
    
    // Check if ID number already exists in User collection
    const existingIdUser = await User.findOne({ idNumber });
    if (existingIdUser) {
      return res.status(400).json({ message: 'A student with this ID number already exists' });
    }
    
    // Also check if this email/ID is already in pending registrations
    const existingPending = await Student.findOne({ 
      $or: [
        { 'pendingRegistration.email': email },
        { 'pendingRegistration.idNumber': idNumber }
      ],
      approvalStatus: 'pending'
    });
    
    if (existingPending) {
      return res.status(400).json({ message: 'A registration with this email or ID is already pending approval' });
    }
    
    // Ensure yearLevel is in the proper ordinal format for class matching (2nd, 3rd, 4th)
    // The frontend should already provide this format, but we double-check here
    let formattedYearLevel = yearLevel;
    
    // If it's just a number, convert to ordinal format
    if (/^[0-9]+$/.test(yearLevel)) {
      if (yearLevel === '2') {
        formattedYearLevel = '2nd';
      } else if (yearLevel === '3') {
        formattedYearLevel = '3rd';
      } else if (yearLevel === '4') {
        formattedYearLevel = '4th';
      }
      console.log(`Converted numeric year level "${yearLevel}" to ordinal format "${formattedYearLevel}"`);
    }
    
    // Try to find an appropriate class based on year level and section
    let classObj = null;
    try {
      // Use the formatted year level for class matching
      const classFilter = {
        yearLevel: formattedYearLevel,
        section,
        status: 'active'
      };
      
      if (major) {
        classFilter.major = major;
      }
      
      classObj = await Class.findOne(classFilter);
      
      if (classObj) {
        console.log('Found matching class:', classObj._id);
      } else {
        console.warn(`No matching class found for year level ${formattedYearLevel}, section ${section}, and major ${major}. Creating student without class assignment.`);
        
        // Try to find alternative match with just yearLevel and section
        const alternativeClass = await Class.findOne({
          yearLevel: formattedYearLevel,
          section,
          status: 'active'
        });
        
        if (alternativeClass) {
          console.log('Found alternative class match:', alternativeClass._id);
          classObj = alternativeClass;
        }
      }
    } catch (classError) {
      console.error('Error finding class:', classError);
    }
    
    // Create student record with pending approval status
    // But store user data in a pendingRegistration field instead of creating a user
    const student = new Student({
      pendingRegistration: {
        firstName,
        middleName: middleName || '',
        lastName,
        nameExtension: nameExtension || 'N/A',
        idNumber,
        email,
        password, // This will be hashed when creating the actual user
      },
      class: classObj ? classObj._id : null,
      classDetails: {
        yearLevel: formattedYearLevel, // Use the formatted year level to ensure consistency
        section,
        major: major || 'Business Informatics' // Default to a major if not specified
      },
      gender,
      contactNumber,
      address: {
        block: address?.block || '',
        street: address?.street || '',
        barangay: address?.barangay || '',
        municipality: address?.municipality || '',
        province: address?.province || ''
      },
      major: major || 'Business Informatics', // Default to a major if not specified
      odysseyPlanCompleted: false,
      srmSurveyCompleted: false,
      approvalStatus: 'pending',
      status: 'inactive'
    });
    
    await student.save();
    console.log('Student pending registration created with ID:', student._id);
    
    res.status(201).json({ 
      message: 'Registration successful. Your account is pending admin approval. You will be notified via email when approved.'
    });
    
  } catch (error) {
    console.error('Student registration error:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ 
      message: 'Server error during registration',
      error: error.message 
    });
  }
});

// Update password
router.post('/update-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user._id);
    
    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    
    // Clear password change required flag if it was set
    if (user.passwordChangeRequired) {
      user.passwordChangeRequired = false;
    }
    
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 