const express = require('express');
const router = express.Router();
const SessionCompletion = require('../models/SessionCompletion');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin, authorizeAdviser } = require('../middleware/auth');
const mongoose = require('mongoose');

// Initialize sessions for a student (creates all session records for a class)
router.post('/init/:studentId/:classId', authenticate, async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Verify class exists and get subject info
    const classData = await Class.findById(classId).populate('sspSubject');
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (!classData.sspSubject) {
      return res.status(404).json({ message: 'Class has no SSP subject assigned' });
    }
    
    // Get full subject details with sessions
    const subject = await Subject.findById(classData.sspSubject._id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if student already has sessions created
    const existingSessions = await SessionCompletion.countDocuments({
      student: studentId,
      class: classId
    });
    
    if (existingSessions > 0) {
      return res.status(400).json({ 
        message: 'Sessions already initialized for this student in this class',
        count: existingSessions
      });
    }
    
    // Create session completion records for each session in the subject
    const sessionRecords = subject.sessions.map(session => ({
      student: studentId,
      class: classId,
      subject: subject._id,
      session: session._id,
      sessionDay: session.day,
      sessionTitle: session.title,
      completed: false
    }));
    
    if (sessionRecords.length === 0) {
      return res.status(400).json({ message: 'No sessions found in the subject' });
    }
    
    // Insert all session records
    await SessionCompletion.insertMany(sessionRecords);
    
    res.status(201).json({ 
      message: 'Session records initialized successfully',
      count: sessionRecords.length
    });
  } catch (error) {
    console.error('Session initialization error:', error);
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Some sessions already exist for this student' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all sessions for a student in a class
router.get('/student/:studentId/class/:classId', authenticate, async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get all session completions for the student in the class
    const sessions = await SessionCompletion.find({
      student: studentId,
      class: classId
    }).sort({ sessionDay: 1 });
    
    res.json(sessions);
  } catch (error) {
    console.error('Get student sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all sessions for a class (for advisers)
router.get('/class/:classId', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Verify class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Get all students in the class
    const studentIds = classData.students || [];
    
    // Get all session completions grouped by student
    const sessions = await SessionCompletion.find({
      class: classId
    }).populate('student', '_id');
    
    // Group sessions by student
    const sessionsByStudent = {};
    sessions.forEach(session => {
      const studentId = session.student._id.toString();
      if (!sessionsByStudent[studentId]) {
        sessionsByStudent[studentId] = [];
      }
      sessionsByStudent[studentId].push(session);
    });
    
    res.json(sessionsByStudent);
  } catch (error) {
    console.error('Get class sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get session completion matrix for a class
router.get('/matrix/:classId', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Verify class exists and get subject
    const classData = await Class.findById(classId)
      .populate('sspSubject')
      .populate({
        path: 'students',
        populate: {
          path: 'user',
          select: 'firstName lastName idNumber'
        }
      });
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (!classData.sspSubject) {
      return res.status(404).json({ message: 'Class has no SSP subject assigned' });
    }
    
    // Get full subject details with sessions
    const subject = await Subject.findById(classData.sspSubject._id);
    if (!subject || !subject.sessions || subject.sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found for the class subject' });
    }
    
    // Get all session completions for the class
    const sessions = await SessionCompletion.find({ class: classId });
    
    // Create a matrix of student session completions
    const students = classData.students || [];
    const matrix = {
      sessions: subject.sessions,
      students: students.map(student => {
        // Find all sessions for this student
        const studentSessions = sessions.filter(session => 
          session.student.toString() === student._id.toString()
        );
        
        // Create a map of session completions
        const sessionsMap = {};
        studentSessions.forEach(session => {
          sessionsMap[session.session.toString()] = {
            completed: session.completed,
            completionDate: session.completionDate,
            id: session._id
          };
        });
        
        return {
          id: student._id,
          name: student.user ? `${student.user.firstName} ${student.user.lastName}` : 'Unknown',
          idNumber: student.user ? student.user.idNumber : '',
          sessions: sessionsMap
        };
      })
    };
    
    res.json(matrix);
  } catch (error) {
    console.error('Get session matrix error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update session completion status
router.put('/:sessionId', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { completed } = req.body;
    
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Completed status must be a boolean' });
    }
    
    // Find and update the session
    const session = await SessionCompletion.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    session.completed = completed;
    
    // If marked as completed, set completion date and marker
    if (completed) {
      session.completionDate = new Date();
      session.markedBy = req.user.id;
    } else {
      session.completionDate = null;
      session.markedBy = null;
    }
    
    session.updatedAt = new Date();
    await session.save();
    
    res.json({ 
      message: `Session marked as ${completed ? 'completed' : 'incomplete'}`,
      session
    });
  } catch (error) {
    console.error('Update session completion error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Bulk update session completions
router.put('/bulk/:classId', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId } = req.params;
    const { updates } = req.body;
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Updates must be a non-empty array' });
    }
    
    // Verify the class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Process each update
    const results = await Promise.all(updates.map(async update => {
      try {
        const { sessionId, completed } = update;
        
        if (!sessionId || typeof completed !== 'boolean') {
          return { success: false, sessionId, error: 'Invalid update format' };
        }
        
        // Find and update the session
        const session = await SessionCompletion.findById(sessionId);
        
        if (!session) {
          return { success: false, sessionId, error: 'Session not found' };
        }
        
        // Skip if the session is not for the specified class
        if (session.class.toString() !== classId) {
          return { success: false, sessionId, error: 'Session does not belong to the specified class' };
        }
        
        session.completed = completed;
        
        // If marked as completed, set completion date and marker
        if (completed) {
          session.completionDate = new Date();
          session.markedBy = req.user.id;
        } else {
          session.completionDate = null;
          session.markedBy = null;
        }
        
        session.updatedAt = new Date();
        await session.save();
        
        return { success: true, sessionId, completed };
      } catch (error) {
        return { success: false, sessionId: update.sessionId, error: error.message };
      }
    }));
    
    res.json({
      message: 'Bulk update completed',
      results
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Validate and repair session data for a class
router.post('/validate/:classId', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId } = req.params;
    
    // Verify class exists and get subject
    const classData = await Class.findById(classId)
      .populate('sspSubject')
      .populate('students');
    
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    if (!classData.sspSubject) {
      return res.status(404).json({ message: 'Class has no SSP subject assigned' });
    }
    
    // Get full subject details with sessions
    const subject = await Subject.findById(classData.sspSubject._id);
    if (!subject || !subject.sessions || subject.sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found for the class subject' });
    }
    
    // Get all students in the class
    const students = classData.students || [];
    if (students.length === 0) {
      return res.status(400).json({ message: 'No students found in the class' });
    }
    
    // For each student, ensure they have all session records
    const results = {
      totalStudents: students.length,
      processedStudents: 0,
      createdSessions: 0,
      errors: []
    };
    
    for (const student of students) {
      try {
        // Get existing sessions for this student
        const existingSessions = await SessionCompletion.find({
          student: student._id,
          class: classId
        });
        
        // Create a map of existing sessions by subject session ID
        const existingSessionMap = {};
        existingSessions.forEach(session => {
          existingSessionMap[session.session.toString()] = true;
        });
        
        // Identify missing sessions
        const missingSessions = subject.sessions.filter(session => 
          !existingSessionMap[session._id.toString()]
        );
        
        // Create missing session records
        if (missingSessions.length > 0) {
          const sessionRecords = missingSessions.map(session => ({
            student: student._id,
            class: classId,
            subject: subject._id,
            session: session._id,
            sessionDay: session.day,
            sessionTitle: session.title,
            completed: false
          }));
          
          await SessionCompletion.insertMany(sessionRecords);
          results.createdSessions += sessionRecords.length;
        }
        
        results.processedStudents++;
      } catch (error) {
        console.error(`Error processing student ${student._id}:`, error);
        results.errors.push({
          studentId: student._id,
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      message: 'Session validation completed',
      results
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 