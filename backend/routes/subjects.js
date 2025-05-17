const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Get all subjects
router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get subject by ID
router.get('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new subject
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { sspCode, name, yearLevel, sessions, secondSemesterSessions, description, semester, hours, schoolYear } = req.body;
    
    // Check if subject with same code already exists
    const existingSubject = await Subject.findOne({ sspCode });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this SSP code already exists' });
    }
    
    // Validate sessions count
    if (sessions && sessions.length > 18) {
      return res.status(400).json({ message: 'Maximum 18 sessions allowed per subject' });
    }
    
    // Validate second semester sessions count
    if (secondSemesterSessions && secondSemesterSessions.length > 18) {
      return res.status(400).json({ message: 'Maximum 18 sessions allowed for second semester' });
    }
    
    // Create subject
    const subject = new Subject({
      sspCode,
      name: name || sspCode, // Use sspCode as fallback for name
      yearLevel,
      description,
      semester,
      schoolYear: schoolYear || '2024 - 2025', // Default to current school year
      hours: hours || 1, // Default to 1 hour if not specified
      sessions: sessions || [],
      secondSemesterSessions: secondSemesterSessions || [] 
    });
    
    await subject.save();
    
    res.status(201).json(subject);
  } catch (error) {
    console.error('Create subject error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subject
router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { sspCode, name, yearLevel, sessions, secondSemesterSessions, description, semester, hours, schoolYear } = req.body;
    
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Update fields
    if (sspCode) {
      // Check if another subject with this code exists
      const existingSubject = await Subject.findOne({ sspCode, _id: { $ne: req.params.id } });
      if (existingSubject) {
        return res.status(400).json({ message: 'Another subject with this SSP code already exists' });
      }
      subject.sspCode = sspCode;
    }
    
    if (name) subject.name = name;
    if (yearLevel) subject.yearLevel = yearLevel;
    if (description) subject.description = description;
    if (semester) subject.semester = semester;
    if (hours) subject.hours = hours;
    if (schoolYear) subject.schoolYear = schoolYear;
    
    if (sessions) {
      if (sessions.length > 18) {
        return res.status(400).json({ message: 'Maximum 18 sessions allowed per subject' });
      }
      subject.sessions = sessions;
    }
    
    if (secondSemesterSessions) {
      if (secondSemesterSessions.length > 18) {
        return res.status(400).json({ message: 'Maximum 18 sessions allowed for second semester' });
      }
      subject.secondSemesterSessions = secondSemesterSessions;
    }
    
    subject.updatedAt = Date.now();
    await subject.save();
    
    // Return the updated subject
    res.json(subject);
  } catch (error) {
    console.error('Update subject error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Add session to subject
router.post('/:id/sessions', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Session title is required' });
    }
    
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Check if already at 18 sessions
    if (subject.sessions.length >= 18) {
      return res.status(400).json({ message: 'Maximum 18 sessions allowed per subject' });
    }
    
    // Add new session
    subject.sessions.push({ title });
    subject.updatedAt = Date.now();
    
    await subject.save();
    
    res.status(201).json({ message: 'Session added successfully' });
  } catch (error) {
    console.error('Add session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update session status
router.put('/:id/sessions/:sessionId', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { status, title } = req.body;
    
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Find session
    const sessionIndex = subject.sessions.findIndex(
      session => session._id.toString() === req.params.sessionId
    );
    
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Update session
    if (status) subject.sessions[sessionIndex].status = status;
    if (title) subject.sessions[sessionIndex].title = title;
    
    subject.updatedAt = Date.now();
    await subject.save();
    
    res.json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete session
router.delete('/:id/sessions/:sessionId', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Find and remove session
    const sessionIndex = subject.sessions.findIndex(
      session => session._id.toString() === req.params.sessionId
    );
    
    if (sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    subject.sessions.splice(sessionIndex, 1);
    subject.updatedAt = Date.now();
    
    await subject.save();
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 