const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');
const crypto = require('crypto');
const { authenticate, authorizeAdmin, authorizeAdviser } = require('../middleware/auth');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Ultra-basic test route - no database, no error handling, just a simple response
router.get('/basic-test', (req, res) => {
  console.log('Basic test route accessed');
  res.json({ message: 'Basic test successful' });
});

// Get all students
router.get('/', authenticate, authorizeAdviser, async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { status, yearLevel, section, major } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add status filter if provided, default to 'active'
    filter.status = status || 'active';
    
    console.log('Fetching students with filter:', filter);
    
    // Find students with the specified filters
    const students = await Student.find(filter)
      .populate('user', 'firstName middleName lastName nameExtension idNumber email')
      .populate('class', 'yearLevel section major');
    
    console.log(`Found ${students.length} students with status: ${filter.status}`);
    
    // For students with classDetails but no class assigned, find matching classes
    for (const student of students) {
      if (!student.class && student.classDetails && student.classDetails.yearLevel) {
        student._doc.classInfo = {
          yearLevel: student.classDetails.yearLevel,
          section: student.classDetails.section,
          major: student.classDetails.major || student.major
        };
      }
    }
    
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Debug route to test MongoDB Student model
router.get('/test-model', async (req, res) => {
  try {
    console.log('Testing Student model connection');
    
    // 1. Check if the Student model is defined
    if (!Student) {
      return res.status(500).json({ 
        error: 'Student model is not defined' 
      });
    }
    
    // 2. Try to list all model fields
    const fields = Object.keys(Student.schema.paths);
    console.log('Student model fields:', fields);
    
    // 3. Get total count of students (any status)
    const totalCount = await Student.countDocuments();
    console.log('Total students in database:', totalCount);
    
    // 4. Try to create a temporary student (but don't save it)
    const testStudent = new Student({
      pendingRegistration: {
        firstName: 'Test',
        lastName: 'User',
        idNumber: 'TEST-ID',
        email: 'test@example.com',
        password: 'password123'
      },
      gender: 'Male',
      contactNumber: '123456789',
      major: 'Business Informatics',
      approvalStatus: 'pending',
      status: 'inactive'
    });
    
    // 5. Validate the test student
    let validationError = null;
    try {
      await testStudent.validate();
    } catch (err) {
      validationError = err;
      console.error('Validation error:', err);
    }
    
    res.json({
      message: 'Student model diagnostic',
      modelExists: true,
      fields,
      totalStudents: totalCount,
      validationSuccess: !validationError,
      validationError: validationError ? {
        message: validationError.message,
        errors: Object.keys(validationError.errors || {})
      } : null
    });
  } catch (error) {
    console.error('Model test error:', error);
    res.status(500).json({ 
      message: 'Server error in model test', 
      error: error.message,
      stack: error.stack
    });
  }
});

// Get pending registration students
router.get('/pending', authenticate, authorizeAdmin, async (req, res) => {
  try {
    console.log('Fetching pending students');
    
    // Find all students with pending approval status
    const pendingStudents = await Student.find({ approvalStatus: 'pending' })
      .populate('class', 'yearLevel section major');
    
    console.log(`Found ${pendingStudents.length} pending students`);
    
    if (pendingStudents.length === 0) {
      return res.json([]);
    }
    
    // Transform the data to make it compatible with the frontend
    const formattedStudents = pendingStudents.map(student => {
      // Create a formatted student object that has the structure expected by the frontend
      const formattedStudent = student.toObject();
      
      // If there's pendingRegistration data, create a "virtual" user object
      if (student.pendingRegistration) {
        formattedStudent.user = {
          firstName: student.pendingRegistration.firstName,
          middleName: student.pendingRegistration.middleName,
          lastName: student.pendingRegistration.lastName,
          nameExtension: student.pendingRegistration.nameExtension,
          idNumber: student.pendingRegistration.idNumber,
          email: student.pendingRegistration.email,
          status: 'pending'
        };
      }
      
      // Use classDetails if class is not assigned but we have the details
      if (!student.class && student.classDetails && student.classDetails.yearLevel) {
        formattedStudent.classInfo = {
          yearLevel: student.classDetails.yearLevel,
          section: student.classDetails.section,
          major: student.classDetails.major || student.major
        };
      }
      
      return formattedStudent;
    });
    
    console.log(`Successfully processed ${formattedStudents.length} pending students`);
    res.json(formattedStudents);
  } catch (error) {
    console.error('Get pending students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Temporary debug route for pending students (no authentication)
router.get('/pending-debug', async (req, res) => {
  try {
    console.log('Fetching pending students (debug route)');
    
    // Find all students with pending approval status
    const pendingStudents = await Student.find({ approvalStatus: 'pending' });
    console.log(`Found ${pendingStudents.length} pending students`);
    
    // Show the full data structure to debug
    console.log('Pending students data structure:', JSON.stringify(pendingStudents, null, 2));
    
    // Send a simplified response for debugging
    res.json({
      count: pendingStudents.length,
      students: pendingStudents.map(s => ({
        _id: s._id,
        pendingData: s.pendingRegistration ? true : false,
        class: s.class,
        gender: s.gender,
        major: s.major,
        createdAt: s.createdAt
      }))
    });
  } catch (error) {
    console.error('DEBUG - Get pending students error:', error);
    res.status(500).json({ 
      message: 'Server error in debug endpoint', 
      error: error.message,
      stack: error.stack
    });
  }
});

// Completely new test route to diagnose and create test data if needed
router.get('/pending-test', async (req, res) => {
  try {
    console.log('Pending test route accessed');
    
    // First check for ANY pending registrations
    const pendingCount = await Student.countDocuments({ approvalStatus: 'pending' });
    console.log(`Found ${pendingCount} pending students`);
    
    // If no pending students, create a test one
    if (pendingCount === 0) {
      console.log('No pending students found, creating a test pending registration');
      
      const testStudent = new Student({
        pendingRegistration: {
          firstName: 'Test',
          middleName: '',
          lastName: 'Student',
          nameExtension: 'N/A',
          idNumber: 'TEST' + Date.now(),
          email: `test${Date.now()}.au@phinmaed.com`,
          password: 'password123'
        },
        gender: 'Male',
        contactNumber: '09123456789',
        major: 'Business Informatics',
        approvalStatus: 'pending',
        status: 'inactive'
      });
      
      await testStudent.save();
      console.log('Created test pending registration with ID:', testStudent._id);
    }
    
    // Now fetch and return detailed information about all pending registrations
    const pendingStudents = await Student.find({ approvalStatus: 'pending' });
    
    // Return detailed information
    const detailedInfo = pendingStudents.map(student => {
      const studentObj = student.toObject();
      
      return {
        _id: studentObj._id,
        approvalStatus: studentObj.approvalStatus,
        hasPendingData: studentObj.pendingRegistration ? true : false,
        pendingFields: studentObj.pendingRegistration ? Object.keys(studentObj.pendingRegistration) : [],
        hasUser: studentObj.user ? true : false,
        userId: studentObj.user,
        gender: studentObj.gender,
        contactNumber: studentObj.contactNumber,
        major: studentObj.major,
        createdAt: studentObj.createdAt,
        
        // Include a formatted version for frontend testing
        formattedForFrontend: {
          _id: studentObj._id,
          approvalStatus: studentObj.approvalStatus,
          gender: studentObj.gender,
          contactNumber: studentObj.contactNumber,
          major: studentObj.major,
          user: studentObj.pendingRegistration ? {
            firstName: studentObj.pendingRegistration.firstName,
            middleName: studentObj.pendingRegistration.middleName,
            lastName: studentObj.pendingRegistration.lastName,
            nameExtension: studentObj.pendingRegistration.nameExtension,
            idNumber: studentObj.pendingRegistration.idNumber,
            email: studentObj.pendingRegistration.email,
            status: 'pending'
          } : null
        }
      };
    });
    
    res.json({
      message: 'Pending registrations test',
      pendingCount,
      students: detailedInfo
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({
      message: 'Error in test route',
      error: error.message,
      stack: error.stack
    });
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

// A simple test route to check if Student model is working correctly
router.get('/test', async (req, res) => {
  try {
    // Get the names of all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);
    
    // Check if students collection exists
    const studentCollection = collectionNames.includes('students');
    
    // Check the mongoose model
    const modelInfo = {
      name: Student.modelName,
      collection: Student.collection.name,
      schema: Object.keys(Student.schema.paths)
    };
    
    res.json({
      success: true,
      message: 'Student model test',
      existingCollections: collectionNames,
      studentCollectionExists: studentCollection,
      modelInfo
    });
  } catch (error) {
    console.error('Student model test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error testing Student model',
      error: error.message
    });
  }
});

// Review student registration (approve/reject)
router.put('/registration/:id/review', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { approvalStatus, approvalNotes } = req.body;
    
    // Validate input
    if (!approvalStatus || !['approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ message: 'Invalid approval status' });
    }
    
    // Find the student record
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student registration not found' });
    }
    
    if (student.approvalStatus !== 'pending') {
      return res.status(400).json({ message: `Registration has already been ${student.approvalStatus}` });
    }
    
    // Update approval status and notes
    student.approvalStatus = approvalStatus;
    student.approvalNotes = approvalNotes || '';
    
    if (approvalStatus === 'approved') {
      // Create a new user for the student
      const newUser = new User({
        firstName: student.pendingRegistration.firstName,
        middleName: student.pendingRegistration.middleName || '',
        lastName: student.pendingRegistration.lastName,
        nameExtension: student.pendingRegistration.nameExtension || 'N/A',
        idNumber: student.pendingRegistration.idNumber,
        email: student.pendingRegistration.email,
        password: student.pendingRegistration.password, // This will be hashed by the User model
        role: 'student',
        status: 'active',
        passwordChangeRequired: true
      });
      
      await newUser.save();
      
      // Update student record with the new user reference
      student.user = newUser._id;
      student.status = 'active';
      
      // If student doesn't have a class assigned yet, find a matching class
      if (!student.class) {
        // Get details from classDetails
        const { yearLevel, section, major } = student.classDetails || {};
        const studentMajor = major || student.major;
        
        if (yearLevel && section) {
          console.log(`Looking for class with yearLevel: ${yearLevel}, section: ${section}, major: ${studentMajor}`);
          
          // Try to find a matching class
          const matchingClass = await Class.findOne({ 
            yearLevel,
            section,
            major: studentMajor,
            status: 'active'
          });
          
          if (matchingClass) {
            console.log(`Found matching class: ${matchingClass._id}`);
            student.class = matchingClass._id;
            
            // Add student to class's students array
            if (!matchingClass.students.includes(student._id)) {
              matchingClass.students.push(student._id);
              await matchingClass.save();
              console.log(`Added student to class ${matchingClass._id}`);
            }
          } else {
            console.log(`No matching class found for student ${student._id}`);
            
            // Try to find a class with just yearLevel and section
            const alternativeClass = await Class.findOne({
              yearLevel,
              section,
              status: 'active'
            });
            
            if (alternativeClass) {
              console.log(`Found alternative class match: ${alternativeClass._id}`);
              student.class = alternativeClass._id;
              
              if (!alternativeClass.students.includes(student._id)) {
                alternativeClass.students.push(student._id);
                await alternativeClass.save();
                console.log(`Added student to alternative class ${alternativeClass._id}`);
              }
            }
          }
        }
      } else {
        // Student already has a class, ensure they're in the class's students array
        const existingClass = await Class.findById(student.class);
        if (existingClass && !existingClass.students.includes(student._id)) {
          existingClass.students.push(student._id);
          await existingClass.save();
          console.log(`Added student to existing class ${existingClass._id}`);
        }
      }
    }
    
    await student.save();
    
    // Send notification email
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      
      let emailSubject, emailText;
      
      if (approvalStatus === 'approved') {
        emailSubject = 'SSP Management System - Registration Approved';
        emailText = `Dear ${student.pendingRegistration.firstName},
        
Your registration for the SSP Management System has been approved. You can now log in using your email and the password you provided during registration.

Please log in at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}

Thank you,
SSP Management Team`;
      } else {
        emailSubject = 'SSP Management System - Registration Rejected';
        emailText = `Dear ${student.pendingRegistration.firstName},
        
We regret to inform you that your registration for the SSP Management System has been rejected.

${approvalNotes ? `Reason: ${approvalNotes}` : ''}

If you believe this is an error, please contact the SSP Management Team.

Thank you,
SSP Management Team`;
      }
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: student.pendingRegistration.email,
        subject: emailSubject,
        text: emailText
      });
      
      console.log(`Notification email sent to ${student.pendingRegistration.email}`);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // We don't want to fail the request if email fails
    }
    
    res.json({ 
      message: `Registration ${approvalStatus} successfully`,
      student: { 
        id: student._id,
        name: `${student.pendingRegistration.firstName} ${student.pendingRegistration.lastName}`,
        email: student.pendingRegistration.email,
        status: approvalStatus
      }
    });
  } catch (error) {
    console.error('Review registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student by ID - MUST be after all other GET routes to avoid path conflicts
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
      srmSurveyCompleted: false,
      status: 'active'
    });
    
    await student.save();
    
    // Add student to class's students array if not already there
    if (!classObj.students.includes(student._id)) {
      classObj.students.push(student._id);
      await classObj.save();
      console.log(`Added student ${student._id} to class ${classId}`);
    }
    
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
    
    // If class is changing, handle class assignments
    if (classId && classId !== student.class?.toString()) {
      // Check if new class exists
      const newClass = await Class.findById(classId);
      if (!newClass) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Remove from old class if exists
      if (student.class) {
        const oldClass = await Class.findById(student.class);
        if (oldClass) {
          oldClass.students = oldClass.students.filter(
            id => id.toString() !== student._id.toString()
          );
          await oldClass.save();
          console.log(`Removed student ${student._id} from class ${student.class}`);
        }
      }
      
      // Update student's class
      student.class = classId;
      
      // Add to new class
      if (!newClass.students.includes(student._id)) {
        newClass.students.push(student._id);
        await newClass.save();
        console.log(`Added student ${student._id} to class ${classId}`);
      }
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

// Force create a test student for debugging
router.get('/force-create-test', async (req, res) => {
  try {
    console.log('Creating a test student with proper validation bypass');
    
    // Create a test student with all required fields
    const testStudent = new Student({
      pendingRegistration: {
        firstName: 'Force Test',
        middleName: '',
        lastName: 'Student',
        nameExtension: 'N/A',
        idNumber: 'FORCE' + Date.now(),
        email: `forcetest${Date.now()}.au@phinmaed.com`,
        password: 'password123'
      },
      classDetails: {
        yearLevel: '3',
        section: 'South-2',
        major: 'Business Informatics'
      },
      gender: 'Male',
      contactNumber: '09123456789',
      major: 'Business Informatics',
      approvalStatus: 'pending',
      status: 'inactive'
    });
    
    // Save while bypassing validation
    await testStudent.save();
    
    console.log('Successfully created test student with ID:', testStudent._id);
    
    res.json({ 
      success: true,
      message: 'Test student created successfully',
      student: {
        _id: testStudent._id,
        name: `${testStudent.pendingRegistration.firstName} ${testStudent.pendingRegistration.lastName}`,
        email: testStudent.pendingRegistration.email,
        idNumber: testStudent.pendingRegistration.idNumber,
        createdAt: testStudent.createdAt,
        classDetails: testStudent.classDetails
      }
    });
  } catch (error) {
    console.error('Force create student error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating test student',
      error: error.message,
      stack: error.stack
    });
  }
});

// Match and assign students to classes based on yearLevel, section, and major
router.post('/assign-classes', authenticate, authorizeAdmin, async (req, res) => {
  try {
    console.log('Starting to assign students to classes');
    
    // Get all active classes
    const classes = await Class.find({ status: 'active' });
    console.log(`Found ${classes.length} active classes`);
    
    // Get all students (both active and pending approved)
    const students = await Student.find({
      $or: [
        { status: 'active' },
        { approvalStatus: 'approved' }
      ]
    }).populate('user', 'firstName lastName'); // Populate user for better logging
    
    console.log(`Found ${students.length} total students to process`);
    
    let assignedCount = 0;
    let updatedClasses = [];
    let failedStudents = [];
    
    // For each student, find matching class
    for (const student of students) {
      try {
        const studentName = student.user ? `${student.user.firstName} ${student.user.lastName}` : `Student ${student._id}`;
        console.log(`Processing student ${student._id} (${studentName})`);
        
        // Skip if already assigned to a class and class exists
        if (student.class) {
          const existingClass = classes.find(c => c._id.toString() === student.class.toString());
          if (existingClass) {
            console.log(`Student ${studentName} already assigned to class ${student.class}`);
            continue;
          } else {
            console.log(`Student ${studentName} has invalid class reference ${student.class}, will reassign`);
          }
        }
        
        // Get class details from either classDetails or directly from student
        const yearLevel = student.classDetails?.yearLevel || '';
        const section = student.classDetails?.section || '';
        const major = student.classDetails?.major || student.major || '';
        
        if (!yearLevel || !section) {
          console.log(`Student ${studentName} missing yearLevel or section info, skipping`);
          failedStudents.push({
            id: student._id,
            name: studentName,
            reason: 'Missing yearLevel or section information'
          });
          continue; // Skip if missing required info
        }
        
        console.log(`Looking for a class matching: ${yearLevel} Year - ${section} - ${major}`);
        
        // Normalize year level for comparison (handle both "2" and "2nd" formats)
        const normalizedYearLevel = yearLevel.toString().replace(/[^0-9]/g, '');
        
        // Find a matching class - first try exact match with all criteria
        let matchingClass = classes.find(c => {
          const classYearLevel = c.yearLevel.toString().replace(/[^0-9]/g, '');
          return classYearLevel === normalizedYearLevel && 
                 c.section === section && 
                 c.major === major &&
                 c.status === 'active';
        });
        
        // If no exact match, try without matching major (if major is empty)
        if (!matchingClass && (!major || major.trim() === '')) {
          console.log(`No exact match with empty major, trying year and section only`);
          matchingClass = classes.find(c => {
            const classYearLevel = c.yearLevel.toString().replace(/[^0-9]/g, '');
            return classYearLevel === normalizedYearLevel && 
                   c.section === section &&
                   c.status === 'active';
          });
        }
        
        if (matchingClass) {
          console.log(`Found matching class ${matchingClass._id} (${matchingClass.yearLevel} Year - ${matchingClass.section}) for student ${studentName}`);
          
          // Assign student to class
          student.class = matchingClass._id;
          
          // Update class details on student for reference
          student.classDetails = {
            yearLevel: matchingClass.yearLevel,
            section: matchingClass.section,
            major: matchingClass.major
          };
          
          await student.save();
          console.log(`Saved student ${studentName} with class ${matchingClass._id}`);
          
          // Add student to class's students array if not already there
          if (!matchingClass.students.includes(student._id)) {
            matchingClass.students.push(student._id);
            
            if (!updatedClasses.includes(matchingClass._id.toString())) {
              updatedClasses.push(matchingClass._id.toString());
            }
            
            await matchingClass.save();
            console.log(`Added student ${studentName} to class ${matchingClass._id}'s student list`);
          } else {
            console.log(`Student ${studentName} already in class ${matchingClass._id}'s student list`);
          }
          
          assignedCount++;
        } else {
          console.log(`No matching class found for student ${studentName} with ${yearLevel} Year - ${section} - ${major}`);
          failedStudents.push({
            id: student._id,
            name: studentName,
            reason: `No matching class for ${yearLevel} Year - ${section} - ${major}`
          });
        }
      } catch (studentError) {
        const studentName = student.user ? `${student.user.firstName} ${student.user.lastName}` : `Student ${student._id}`;
        console.error(`Error processing student ${studentName}:`, studentError);
        failedStudents.push({
          id: student._id,
          name: studentName,
          reason: studentError.message || 'Unknown error'
        });
      }
    }
    
    console.log(`Assigned ${assignedCount} students to classes`);
    console.log(`Updated ${updatedClasses.length} classes`);
    console.log(`Failed to assign ${failedStudents.length} students`);
    
    res.json({
      success: true, 
      message: `Assigned ${assignedCount} students to classes`,
      stats: {
        processed: students.length,
        assigned: assignedCount,
        failed: failedStudents.length,
        updatedClasses: updatedClasses.length
      },
      updatedClasses,
      failedStudents: failedStudents.length > 0 ? failedStudents : undefined
    });
  } catch (error) {
    console.error('Error assigning students to classes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error assigning students to classes', 
      error: error.message 
    });
  }
});

// Get students by class ID
router.get('/by-class/:classId', authenticate, async (req, res) => {
  try {
    const { classId } = req.params;
    console.log(`Fetching students for class: ${classId}`);
    
    // Validate class ID
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: 'Invalid class ID format' });
    }
    
    // First check if the class exists
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    console.log(`Class found: ${classItem.yearLevel} Year - ${classItem.section} (${classItem.major})`);
    
    // Get students directly assigned to this class
    const studentsFromClassRef = await Student.find({
      class: classId,
      status: 'active'
    }).populate('user', 'firstName middleName lastName nameExtension idNumber email');
    
    console.log(`Found ${studentsFromClassRef.length} students with direct class reference`);
    
    // Also look for students with matching classDetails but no class reference
    // This helps find students who should be in this class but don't have the proper reference
    const studentsFromClassDetails = await Student.find({
      class: { $exists: false },
      'classDetails.yearLevel': classItem.yearLevel,
      'classDetails.section': classItem.section,
      'classDetails.major': classItem.major,
      status: 'active'
    }).populate('user', 'firstName middleName lastName nameExtension idNumber email');
    
    console.log(`Found ${studentsFromClassDetails.length} additional students via classDetails match`);
    
    // Combine the results
    const allStudents = [...studentsFromClassRef];
    
    // For students found by classDetails, assign them to this class too
    for (const student of studentsFromClassDetails) {
      console.log(`Assigning student ${student._id} to class ${classId} based on matching details`);
      student.class = classId;
      await student.save();
      
      // Add to class students array if not already there
      if (!classItem.students.includes(student._id)) {
        classItem.students.push(student._id);
      }
      
      allStudents.push(student);
    }
    
    // Save class if we've updated its students array
    if (studentsFromClassDetails.length > 0) {
      await classItem.save();
      console.log(`Updated class ${classId} with ${studentsFromClassDetails.length} new students`);
    }
    
    console.log(`Returning total of ${allStudents.length} students for class ${classId}`);
    res.json(allStudents);
  } catch (error) {
    console.error('Get students by class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Assign a student to a class manually
router.post('/:id/assign-class', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { classId } = req.body;
    
    if (!classId) {
      return res.status(400).json({ message: 'Class ID is required' });
    }
    
    // Find student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Find class
    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Remove student from previous class if any
    if (student.class) {
      const oldClass = await Class.findById(student.class);
      if (oldClass) {
        // Remove student from old class's students array
        oldClass.students = oldClass.students.filter(
          studentId => studentId.toString() !== student._id.toString()
        );
        await oldClass.save();
        console.log(`Removed student ${student._id} from class ${oldClass._id}`);
      }
    }
    
    // Update student's class
    student.class = classId;
    
    // Update class details on student for reference
    student.classDetails = {
      yearLevel: classObj.yearLevel,
      section: classObj.section,
      major: classObj.major
    };
    
    await student.save();
    
    // Add student to new class's students array if not already there
    if (!classObj.students.includes(student._id)) {
      classObj.students.push(student._id);
      await classObj.save();
      console.log(`Added student ${student._id} to class ${classObj._id}`);
    }
    
    res.json({ 
      success: true, 
      message: 'Student assigned to class successfully',
      student: {
        id: student._id,
        name: student.user ? `${student.user.firstName} ${student.user.lastName}` : 'Unknown',
        class: {
          id: classObj._id,
          name: `${classObj.yearLevel} Year - ${classObj.section} (${classObj.major})`
        }
      }
    });
  } catch (error) {
    console.error('Assign student to class error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fix student year level format - This is no longer needed as we ensure correct format at registration
router.put('/:id/fix-yearLevel', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { yearLevel, currentYearLevel } = req.body;
    
    if (!yearLevel) {
      return res.status(400).json({ message: 'New year level is required' });
    }
    
    // Find the student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log(`Fixing year level for student ${id} from ${currentYearLevel || 'unknown'} to ${yearLevel}`);
    
    // Update the classDetails.yearLevel field
    if (!student.classDetails) {
      student.classDetails = {
        yearLevel,
        section: student.classDetails?.section || '',
        major: student.classDetails?.major || student.major || ''
      };
    } else {
      student.classDetails.yearLevel = yearLevel;
    }
    
    // Save the student
    await student.save();
    console.log(`Student ${id} year level updated to ${yearLevel}`);
    
    // Try to find a class with the updated year level format
    if (student.classDetails.section) {
      console.log(`Looking for class with yearLevel=${yearLevel}, section=${student.classDetails.section}`);
      
      const matchingClass = await Class.findOne({
        yearLevel,
        section: student.classDetails.section,
        status: 'active'
      });
      
      if (matchingClass) {
        console.log(`Found matching class ${matchingClass._id}, updating student's class reference`);
        
        // Update the student's class reference
        student.class = matchingClass._id;
        await student.save();
        
        // Add student to class's students array if not already there
        if (!matchingClass.students.includes(student._id)) {
          matchingClass.students.push(student._id);
          await matchingClass.save();
          console.log(`Added student ${id} to class ${matchingClass._id}`);
        }
      } else {
        console.log(`No matching class found for student ${id} with ${yearLevel} Year - ${student.classDetails.section}`);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Student year level format updated successfully',
      student: {
        id: student._id,
        yearLevel,
        previousYearLevel: currentYearLevel || 'unknown'
      }
    });
  } catch (error) {
    console.error('Fix year level error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fixing year level format', 
      error: error.message 
    });
  }
});

module.exports = router; 