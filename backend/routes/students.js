const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');
const crypto = require('crypto');
const { authenticate, authorizeAdmin, authorizeAdviser } = require('../middleware/auth');

// Get all students
router.get('/', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const students = await Student.find({ status: 'active' })
      .populate('user', 'firstName middleName lastName nameExtension idNumber email')
      .populate('class', 'yearLevel section major');
    
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID
router.get('/:id', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'firstName middleName lastName nameExtension idNumber email')
      .populate('class', 'yearLevel section major');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new student
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { firstName, middleName, lastName, nameExtension, idNumber, email, classId } = req.body;
    
    // Check if class exists
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Generate random password
    const tempPassword = crypto.randomBytes(10).toString('hex');
    
    // Create student user
    const user = new User({
      firstName,
      middleName,
      lastName,
      nameExtension: nameExtension || 'N/A',
      idNumber,
      salutation: 'Student',
      email,
      password: tempPassword,
      role: 'student'
    });
    
    await user.save();
    
    // Create student record
    const student = new Student({
      user: user._id,
      class: classId,
      odysseyPlanCompleted: false,
      srmSurveyCompleted: false
    });
    
    await student.save();
    
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { classId, odysseyPlanCompleted, srmSurveyCompleted, status } = req.body;
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Update fields
    if (classId) {
      // Check if class exists
      const classObj = await Class.findById(classId);
      if (!classObj) {
        return res.status(404).json({ message: 'Class not found' });
      }
      student.class = classId;
    }
    
    if (odysseyPlanCompleted !== undefined) student.odysseyPlanCompleted = odysseyPlanCompleted;
    if (srmSurveyCompleted !== undefined) student.srmSurveyCompleted = srmSurveyCompleted;
    
    if (status) {
      if (!['active', 'inactive', 'archived'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      student.status = status;
      
      // Update user status as well
      await User.findByIdAndUpdate(student.user, { status });
    }
    
    student.updatedAt = Date.now();
    await student.save();
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete student
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Instead of deleting, mark as archived
    student.status = 'archived';
    student.updatedAt = Date.now();
    await student.save();
    
    // Update user status as well
    await User.findByIdAndUpdate(student.user, { status: 'archived' });
    
    res.json({ message: 'Student archived successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add consultation record
router.post('/:id/consultations', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { notes, date } = req.body;
    
    if (!notes || !date) {
      return res.status(400).json({ message: 'Notes and date are required' });
    }
    
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Add consultation
    student.consultations.push({
      notes,
      date,
      adviser: req.user._id
    });
    
    student.updatedAt = Date.now();
    await student.save();
    
    res.status(201).json({ message: 'Consultation added successfully' });
  } catch (error) {
    console.error('Add consultation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data
router.get('/analytics/data', authenticate, authorizeAdmin, async (req, res) => {
  try {
    // Get total counts
    const totalStudents = await Student.countDocuments({ status: 'active' });
    
    // Get completion rates
    const odysseyCompleted = await Student.countDocuments({ 
      status: 'active',
      odysseyPlanCompleted: true 
    });
    
    const srmCompleted = await Student.countDocuments({ 
      status: 'active',
      srmSurveyCompleted: true 
    });
    
    // Calculate completion percentages
    const odysseyCompletionRate = totalStudents > 0 ? (odysseyCompleted / totalStudents) * 100 : 0;
    const srmCompletionRate = totalStudents > 0 ? (srmCompleted / totalStudents) * 100 : 0;
    
    // Get consultation count
    const consultationCount = await Student.aggregate([
      { $match: { status: 'active' } },
      { $project: { consultationCount: { $size: '$consultations' } } },
      { $group: { _id: null, total: { $sum: '$consultationCount' } } }
    ]);
    
    const totalConsultations = consultationCount.length > 0 ? consultationCount[0].total : 0;
    
    res.json({
      totalStudents,
      odysseyCompletion: {
        completed: odysseyCompleted,
        rate: odysseyCompletionRate
      },
      srmCompletion: {
        completed: srmCompleted,
        rate: srmCompletionRate
      },
      consultations: totalConsultations
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 