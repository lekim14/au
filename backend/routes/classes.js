const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const AdvisoryClass = require('../models/AdvisoryClass');
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const User = require('../models/User');

// Get all classes
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    // Get status from query parameters, default to 'active'
    const status = req.query.status || 'active';
    
    // Check if status is valid
    if (!['active', 'inactive', 'all'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status parameter' });
    }
    
    let query = {};
    
    // Apply status filter if not requesting all classes
    if (status !== 'all') {
      query.status = status;
    }
    
    // Populate the subject with more fields including semester
    const classes = await Class.find(query)
      .populate('sspSubject', 'sspCode name semester schoolYear hours sessions secondSemesterSessions');
    
    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get class by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching class with ID: ${id}`);
    
    // Check if class exists
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid class ID format' });
    }
    
    // First get the class with populated students and subject
    const classItem = await Class.findById(id)
      .populate('sspSubject', 'sspCode name sessions semester schoolYear hours secondSemesterSessions')
      .populate({
        path: 'students',
        populate: {
          path: 'user',
          select: 'firstName middleName lastName nameExtension idNumber email'
        }
      });
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    console.log(`Found class: ${classItem.yearLevel} Year - ${classItem.section} (${classItem.major})`);
    console.log(`Class has ${classItem.students.length} students in students array`);
    console.log(`Class subject data:`, classItem.sspSubject);
    
    // Look for any additional students that should be in this class but aren't in the students array
    // This helps cover cases where the student.class reference exists but the class.students array wasn't updated
    const additionalStudents = await Student.find({
      class: id,
      _id: { $nin: classItem.students },
      status: 'active'
    }).populate('user', 'firstName middleName lastName nameExtension idNumber email');
    
    console.log(`Found ${additionalStudents.length} additional students with class reference`);
    
    // If we found additional students, add them to the class.students array
    if (additionalStudents.length > 0) {
      for (const student of additionalStudents) {
        classItem.students.push(student);
      }
      
      // Save the class to update the students array
      const updatedClassItem = await Class.findByIdAndUpdate(
        id, 
        { $addToSet: { students: { $each: additionalStudents.map(s => s._id) } } },
        { new: true }
      );
      
      console.log(`Updated class ${id} with ${additionalStudents.length} new students`);
    }
    
    // Also look for students with matching classDetails but no class reference
    // Normalize section format for comparison
    const normalizedClassSection = classItem.section.replace(/\s*-\s*/g, '-');
    
    const matchingStudents = await Student.find({
      'classDetails.yearLevel': classItem.yearLevel,
      $or: [
        { 'classDetails.section': classItem.section },
        { 'classDetails.section': normalizedClassSection }
      ],
      'classDetails.major': classItem.major,
      status: 'active',
      $or: [
        { class: { $exists: false } },
        { class: null }
      ]
    }).populate('user', 'firstName middleName lastName nameExtension idNumber email');
    
    console.log(`Found ${matchingStudents.length} students with matching classDetails but no class reference`);
    
    // If we found matching students, add the class reference to each student and add them to class.students
    if (matchingStudents.length > 0) {
      const studentIds = matchingStudents.map(s => s._id);
      
      // Update all matching students to set their class reference
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $set: { class: id } }
      );
      
      // Update the class to add these students
      await Class.findByIdAndUpdate(
        id, 
        { $addToSet: { students: { $each: studentIds } } }
      );
      
      console.log(`Updated ${matchingStudents.length} students with class reference and added to class ${id}`);
      
      // Add these students to our result
      for (const student of matchingStudents) {
        if (!classItem.students.some(s => s._id.toString() === student._id.toString())) {
          classItem.students.push(student);
        }
      }
    }
    
    // Return the class with all students
    console.log(`Returning class with ${classItem.students.length} total students`);
    res.json(classItem);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new class
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { yearLevel, section, major, daySchedule, timeSchedule, room, sspSubjectId, hours } = req.body;
    
    // Check if yearLevel is provided
    if (!yearLevel) {
      return res.status(400).json({ message: 'Year level is required' });
    }
    
    // Check if section is provided
    if (!section) {
      return res.status(400).json({ message: 'Section is required' });
    }
    
    // Check if major is provided
    if (!major) {
      return res.status(400).json({ message: 'Major is required' });
    }
    
    // Check if SSP subject ID is provided
    if (!sspSubjectId) {
      return res.status(400).json({ message: 'SSP Subject is required' });
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
    
    // If hours not provided, get from subject
    const classHours = hours || subject.hours || 1;
    
    // Create new class
    const newClass = new Class({
      yearLevel,
      section,
      major,
      daySchedule,
      timeSchedule,
      room,
      hours: classHours,
      sspSubject: sspSubjectId  // Map sspSubjectId to sspSubject for the database
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
    const { yearLevel, section, major, daySchedule, timeSchedule, room, sspSubjectId, status, hours } = req.body;
    
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
    if (hours) classItem.hours = hours;
    
    if (sspSubjectId) {
      // Check if SSP subject exists
      const subject = await Subject.findById(sspSubjectId);
      if (!subject) {
        return res.status(404).json({ message: 'SSP Subject not found' });
      }
      classItem.sspSubject = sspSubjectId;
      
      // If hours not provided but subject changed, update hours from subject
      if (!hours && subject.hours) {
        classItem.hours = subject.hours;
      }
    }
    
    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Use active or inactive' });
      }
      
      const oldStatus = classItem.status;
      classItem.status = status;
      
      // If class is set to inactive, delete related advisory classes
      if (status === 'inactive' && oldStatus === 'active') {
        console.log(`Moving class ${classItem._id} to inactive/archive status`);
        await AdvisoryClass.deleteMany({ class: classItem._id });
      }
      
      // If class is being reactivated, update lastActive date
      if (status === 'active' && oldStatus === 'inactive') {
        console.log(`Reactivating class ${classItem._id} from archived status`);
        classItem.lastActive = Date.now();
      }
    }
    
    classItem.updatedAt = Date.now();
    await classItem.save();
    
    res.json(classItem);
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

// Find class by year level, section, and major
router.post('/by-class-details', authenticate, async (req, res) => {
  try {
    const { yearLevel, section, major } = req.body;
    
    if (!yearLevel || !section || !major) {
      return res.status(400).json({ 
        message: 'Year level, section, and major are required',
        provided: { yearLevel, section, major } 
      });
    }
    
    console.log(`Finding class with yearLevel=${yearLevel}, section=${section}, major=${major}`);
    
    // Normalize yearLevel to handle both "2" and "2nd" formats
    const normalizedYearLevel = yearLevel.toString().replace(/[^0-9]/g, '');
    console.log(`Normalized year level: ${normalizedYearLevel}`);
    
    // Normalize section format to handle different formats (e.g., "South-2" vs "South - 2")
    const normalizedSection = section.replace(/\s*-\s*/g, '-');
    console.log(`Normalized section: ${normalizedSection}`);
    
    // Find classes with matching criteria
    const classes = await Class.find({
      status: 'active'
    }).populate('sspSubject').populate({
      path: 'students',
      populate: {
        path: 'user',
        select: 'firstName middleName lastName nameExtension idNumber email'
      }
    });
    
    console.log(`Found ${classes.length} active classes total`);
    
    // Find matching class by comparing normalized values
    const matchingClass = classes.find(c => {
      const classYearLevel = c.yearLevel.toString().replace(/[^0-9]/g, '');
      const classSection = c.section.replace(/\s*-\s*/g, '-');
      return classYearLevel === normalizedYearLevel && 
             classSection === normalizedSection && 
             c.major === major;
    });
    
    if (!matchingClass) {
      console.log(`No exact match found for yearLevel=${yearLevel}, section=${section}, major=${major}`);
      return res.status(404).json({ message: 'No matching active class found' });
    }
    
    console.log(`Found matching class: ${matchingClass._id}`);
    res.json(matchingClass);
  } catch (error) {
    console.error('Find class by details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reactivate an archived class
router.put('/reactivate/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const classId = req.params.id;
    console.log(`Attempting to reactivate class ${classId}`);
    
    // Find the class and validate it exists
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Validate the class is currently inactive
    if (classItem.status === 'active') {
      return res.status(400).json({ message: 'Class is already active' });
    }
    
    // Update the class status
    classItem.status = 'active';
    classItem.lastActive = Date.now();
    classItem.updatedAt = Date.now();
    await classItem.save();
    
    console.log(`Successfully reactivated class ${classId}`);
    
    // Return the reactivated class
    res.json({
      message: 'Class reactivated successfully',
      class: await Class.findById(classId).populate('sspSubject', 'sspCode')
    });
  } catch (error) {
    console.error('Reactivate class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all classes - with adviser-friendly authentication
router.get('/all-for-adviser', authenticate, async (req, res) => {
  try {
    console.log('Getting all active classes for adviser view');
    
    // Check if user is admin or adviser
    if (req.user.role !== 'admin' && req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Access denied. Admin or adviser role required.' });
    }
    
    const userId = req.user.id;
    console.log(`Request from user ${userId} with role ${req.user.role}`);
    
    let query = { status: 'active' };
    
    // If user is an adviser, only return their classes
    if (req.user.role === 'adviser') {
      query.adviser = userId;
    }
    
    // Get classes with populated SSP subject
    const classes = await Class.find(query)
      .populate({
        path: 'sspSubject',
        select: 'sspCode yearLevel hours schoolYear semester'
      })
      .lean();
    
    console.log(`Found ${classes.length} classes matching query`);
    
    // For each class, count the students
    const enhancedClasses = await Promise.all(classes.map(async (classItem) => {
      // Count students in this class
      const studentCount = await Student.countDocuments({
        class: classItem._id,
        status: 'active'
      });
      
      return {
        ...classItem,
        studentCount
      };
    }));
    
    return res.json(enhancedClasses);
  } catch (error) {
    console.error('Error getting classes for adviser view:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a class by ID with adviser-friendly authentication
router.get('/by-id/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    console.log(`User ${userId} with role ${userRole} accessing class ${id}`);
    
    // Verify user has permission (admin or assigned adviser)
    if (userRole !== 'admin' && userRole !== 'adviser') {
      console.warn(`User ${userId} with role ${userRole} attempted to access class ${id}`);
      return res.status(403).json({ message: 'Access denied. Admin or adviser role required.' });
    }
    
    // Find the class with populated subject
    const classItem = await Class.findById(id)
      .populate({
        path: 'sspSubject',
        select: 'sspCode yearLevel hours schoolYear semester'
      })
      .populate('adviser');
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // If user is an adviser, check if they are assigned to this class
    if (userRole === 'adviser' && classItem.adviser) {
      if (classItem.adviser._id.toString() !== userId) {
        // Check if the user is designated as an admin-adviser (special case)
        const isAdminAdviser = await User.findOne({
          _id: userId,
          role: 'adviser',
          isAdminAdviser: true
        });
        
        if (!isAdminAdviser) {
          console.warn(`Adviser ${userId} attempted to access class ${id} assigned to adviser ${classItem.adviser._id}`);
          return res.status(403).json({ message: 'Access denied. You are not assigned to this class.' });
        }
      }
    }
    
    // Count students in this class
    const studentCount = await Student.countDocuments({
      class: id,
      status: 'active'
    });
    
    // Add student count to the response
    const result = {
      ...classItem.toObject(),
      studentCount
    };
    
    console.log(`Returning class ${id} with ${studentCount} students`);
    return res.json(result);
  } catch (error) {
    console.error('Error getting class by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 