const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const AdvisoryClass = require('../models/AdvisoryClass');
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Get all classes
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const classes = await Class.find({ status: 'active' }).populate('sspSubject', 'sspCode');
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class by ID
router.get('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id).populate('sspSubject');
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    res.json(classItem);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new class
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { yearLevel, section, major, daySchedule, timeSchedule, room, sspSubjectId } = req.body;
    
    // Validate section based on year level
    if (yearLevel === '2nd') {
      if (!['South-1', 'South-2', 'South-3', 'South-4'].includes(section)) {
        return res.status(400).json({ message: 'Invalid section for 2nd year' });
      }
    } else if (yearLevel === '3rd') {
      if (!['South-1', 'South-2', 'South-3'].includes(section)) {
        return res.status(400).json({ message: 'Invalid section for 3rd year' });
      }
    } else if (yearLevel === '4th') {
      if (!['South-1', 'South-2'].includes(section)) {
        return res.status(400).json({ message: 'Invalid section for 4th year' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid year level' });
    }
    
    // Check if SSP subject exists
    const subject = await Subject.findById(sspSubjectId);
    if (!subject) {
      return res.status(404).json({ message: 'SSP Subject not found' });
    }
    
    // Check if the class already exists
    const existingClass = await Class.findOne({
      yearLevel,
      section,
      major,
      status: 'active'
    });
    
    if (existingClass) {
      return res.status(400).json({ message: 'This class already exists' });
    }
    
    // Create new class
    const newClass = new Class({
      yearLevel,
      section,
      major,
      daySchedule,
      timeSchedule,
      room,
      sspSubject: sspSubjectId
    });
    
    await newClass.save();
    
    res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update class
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { yearLevel, section, major, daySchedule, timeSchedule, room, sspSubjectId, status } = req.body;
    
    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Update fields
    if (yearLevel) classItem.yearLevel = yearLevel;
    if (section) classItem.section = section;
    if (major) classItem.major = major;
    if (daySchedule) classItem.daySchedule = daySchedule;
    if (timeSchedule) classItem.timeSchedule = timeSchedule;
    if (room) classItem.room = room;
    
    if (sspSubjectId) {
      // Check if SSP subject exists
      const subject = await Subject.findById(sspSubjectId);
      if (!subject) {
        return res.status(404).json({ message: 'SSP Subject not found' });
      }
      classItem.sspSubject = sspSubjectId;
    }
    
    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Use active or inactive' });
      }
      
      const oldStatus = classItem.status;
      classItem.status = status;
      
      // If class is set to inactive, delete related advisory classes
      if (status === 'inactive' && oldStatus === 'active') {
        await AdvisoryClass.deleteMany({ class: classItem._id });
      }
    }
    
    classItem.updatedAt = Date.now();
    await classItem.save();
    
    res.json({
      message: 'Class updated successfully',
      class: await Class.findById(classItem._id).populate('sspSubject', 'sspCode')
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class
router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Delete related advisory classes
    await AdvisoryClass.deleteMany({ class: classItem._id });
    
    // Actually delete class from database
    await Class.findByIdAndDelete(req.params.id);
    
    // Return success message
    res.json({
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inactive classes (for archive)
router.get('/archived/all', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const inactiveClasses = await Class.find({
      status: 'inactive'
    }).populate('sspSubject', 'sspCode name');
    
    res.json(inactiveClasses);
  } catch (error) {
    console.error('Get inactive classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 