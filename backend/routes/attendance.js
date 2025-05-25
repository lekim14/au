const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Class = require('../models/Class');
const User = require('../models/User');
const AdvisoryClass = require('../models/AdvisoryClass');
const { authenticate, authorizeAdmin, authorizeAdviser } = require('../middleware/auth');
const mongoose = require('mongoose');

/**
 * @route   GET /attendance/debug/:classId
 * @desc    Debug endpoint to check class authorization
 * @access  Private (Advisers only)
 */
router.get('/debug/:classId', authenticate, async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check class directly
    const classData = await Class.findById(classId);
    
    // Check AdvisoryClass
    const advisoryClass = await AdvisoryClass.findOne({
      class: classId,
      adviser: userId
    });

    // Check class via adviser field
    const classViaAdviser = await Class.findOne({
      _id: classId,
      adviser: userId
    });

    res.json({
      userId,
      userRole,
      classExists: !!classData,
      classData: classData ? {
        id: classData._id,
        adviser: classData.adviser,
        isAdviserMatch: classData.adviser?.toString() === userId
      } : null,
      advisoryClassExists: !!advisoryClass,
      advisoryClassData: advisoryClass ? {
        id: advisoryClass._id,
        classId: advisoryClass.class,
        adviserId: advisoryClass.adviser
      } : null,
      classViaAdviserExists: !!classViaAdviser
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Helper function to check if an adviser is authorized for a class
 */
async function isAdviserAuthorizedForClass(classId, adviserId) {
  try {
    // Check if admin first
    const user = await User.findById(adviserId);
    if (user && user.role === 'admin') {
      return true;
    }

    // First check direct adviser assignment in class
    const classData = await Class.findOne({
      _id: classId,
      adviser: adviserId,
      status: 'active'
    });
    
    if (classData) {
      return true;
    }
    
    // Then check AdvisoryClass assignment
    const advisoryClass = await AdvisoryClass.findOne({
      class: classId,
      adviser: adviserId,
      status: 'active'
    });
    
    return !!advisoryClass;
  } catch (error) {
    console.error('Authorization check error:', error);
    return false;
  }
}

/**
 * @route   POST /attendance/sessions
 * @desc    Create a new attendance session
 * @access  Private (Advisers only)
 */
router.post('/sessions', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId, title, date, topic } = req.body;
    const adviserId = req.user.id;

    // Verify the adviser is authorized for this class
    const isAuthorized = await isAdviserAuthorizedForClass(classId, adviserId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this class.' });
    }

    // Check if a session already exists for this date in this class
    const existingSession = await Attendance.findOne({
      class: classId,
      date: { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) }
    });

    if (existingSession) {
      return res.status(400).json({ message: 'An attendance session already exists for this date.' });
    }

    // Create a new attendance session
    const newSession = new Attendance({
      title,
      date,
      topic,
      class: classId,
      adviser: adviserId,
      records: [] // Will be populated later when attendance is taken
    });

    await newSession.save();

    res.status(201).json({ 
      success: true,
      message: 'Attendance session created successfully',
      session: newSession
    });
  } catch (error) {
    console.error('Create attendance session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /attendance/class/:classId/date/:date
 * @desc    Get attendance session for a specific date
 * @access  Private (Advisers only)
 */
router.get('/class/:classId/date/:date', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId, date } = req.params;
    const adviserId = req.user.id;

    // Verify the adviser is authorized for this class
    const isAuthorized = await isAdviserAuthorizedForClass(classId, adviserId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this class.' });
    }

    // Find the attendance session for the specified date
    const sessionDate = new Date(date);
    const nextDay = new Date(sessionDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const session = await Attendance.findOne({
      class: classId,
      date: { $gte: sessionDate, $lt: nextDay }
    }).populate('records.student', 'user');

    // If no session exists, return empty
    if (!session) {
      return res.json({ session: null, records: [] });
    }

    // Process records to include student information
    const records = [];
    for (const record of session.records) {
      if (record.student && record.student.user) {
        const studentUser = await User.findById(record.student.user);
        if (studentUser) {
          records.push({
            _id: record._id,
            student: {
              _id: record.student._id,
              idNumber: studentUser.idNumber,
              firstName: studentUser.firstName,
              lastName: studentUser.lastName
            },
            present: record.present,
            notes: record.notes
          });
        }
      }
    }

    res.json({
      session: {
        _id: session._id,
        title: session.title,
        date: session.date,
        topic: session.topic
      },
      records
    });
  } catch (error) {
    console.error('Get attendance session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /attendance/class/:classId/history
 * @desc    Get attendance history for a class
 * @access  Private (Advisers only)
 */
router.get('/class/:classId/history', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;
    const adviserId = req.user.id;

    // Verify the adviser is authorized for this class
    const isAuthorized = await isAdviserAuthorizedForClass(classId, adviserId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this class.' });
    }

    // Build query for date filtering
    const query = { class: classId };
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)) 
      };
    }

    // Find all attendance sessions for this class
    const sessions = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('records.student', 'user');

    // Process each session
    const processedSessions = [];
    
    for (const session of sessions) {
      // Process records to include student information
      const records = [];
      for (const record of session.records) {
        if (record.student && record.student.user) {
          const studentUser = await User.findById(record.student.user);
          if (studentUser) {
            records.push({
              _id: record._id,
              student: {
                _id: record.student._id,
                idNumber: studentUser.idNumber,
                firstName: studentUser.firstName,
                lastName: studentUser.lastName
              },
              present: record.present,
              notes: record.notes
            });
          }
        }
      }

      processedSessions.push({
        _id: session._id,
        title: session.title,
        date: session.date,
        topic: session.topic,
        records
      });
    }

    res.json({ sessions: processedSessions });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   POST /attendance/records
 * @desc    Save attendance records for a session
 * @access  Private (Advisers only)
 */
router.post('/records', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { sessionId, classId, records } = req.body;
    const adviserId = req.user.id;

    // Verify the adviser is authorized for this class
    const isAuthorized = await isAdviserAuthorizedForClass(classId, adviserId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this class.' });
    }

    // Find the attendance session
    const session = await Attendance.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    // Ensure this is the correct class
    if (session.class.toString() !== classId) {
      return res.status(400).json({ message: 'Session does not belong to the specified class' });
    }

    // Replace the records array with the new records
    session.records = records;
    await session.save();

    res.json({ 
      success: true, 
      message: 'Attendance records saved successfully' 
    });
  } catch (error) {
    console.error('Save attendance records error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route   GET /attendance/sessions/:sessionId
 * @desc    Get a specific attendance session
 * @access  Private (Advisers only)
 */
router.get('/sessions/:sessionId', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const adviserId = req.user.id;

    // Find the attendance session
    const session = await Attendance.findById(sessionId)
      .populate('records.student', 'user')
      .populate('class');

    if (!session) {
      return res.status(404).json({ message: 'Attendance session not found' });
    }

    // Verify the adviser is authorized for this class
    const isAuthorized = await isAdviserAuthorizedForClass(session.class._id, adviserId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'Access denied. You are not assigned to this session.' });
    }

    // Process records to include student information
    const records = [];
    for (const record of session.records) {
      if (record.student && record.student.user) {
        const studentUser = await User.findById(record.student.user);
        if (studentUser) {
          records.push({
            _id: record._id,
            student: {
              _id: record.student._id,
              idNumber: studentUser.idNumber,
              firstName: studentUser.firstName,
              lastName: studentUser.lastName
            },
            present: record.present,
            notes: record.notes
          });
        }
      }
    }

    res.json({
      session: {
        _id: session._id,
        title: session.title,
        date: session.date,
        topic: session.topic,
        class: session.class
      },
      records
    });
  } catch (error) {
    console.error('Get attendance session details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 