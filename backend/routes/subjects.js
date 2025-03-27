const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const SystemOption = require('../models/SystemOption');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new subject
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    // Get subject data from request body
    const { sspCode, name, yearLevel, sessions, semester, hours, schoolYear } = req.body;
    
    // Check if subject already exists
    const existingSubject = await Subject.findOne({ sspCode });
    if (existingSubject) {
      return res.status(400).json({ message: 'Subject with this SSP Code already exists' });
    }
    
    // Get system options for default zero day session
    let defaultZeroDayTitle = 'INTRODUCTION';
    try {
      const systemOptions = await SystemOption.findOne().sort({ updatedAt: -1 });
      if (systemOptions && systemOptions.subject && systemOptions.subject.defaultZeroDayTitle) {
        defaultZeroDayTitle = systemOptions.subject.defaultZeroDayTitle;
      }
    } catch (error) {
      console.error('Error getting system options:', error);
      // Continue with default
    }
    
    // Validate sessions
    const processedSessions = [];
    let hasZeroDay = false;
    
    if (sessions && sessions.length > 0) {
      for (const session of sessions) {
        processedSessions.push({
          day: session.day,
          title: session.title
        });
        
        if (session.day === 0) {
          hasZeroDay = true;
        }
      }
    }
    
    // Always add day zero if not provided
    if (!hasZeroDay) {
      processedSessions.push({
        day: 0,
        title: defaultZeroDayTitle
      });
    }
    
    // Create new subject
    const newSubject = new Subject({
      sspCode,
      name,
      yearLevel,
      sessions: processedSessions,
      semester,
      hours,
      schoolYear
    });
    
    // Save subject to database
    const savedSubject = await newSubject.save();
    res.json(savedSubject);
  } catch (err) {
    console.error('Error creating subject:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).send('Server Error');
  }
});

// Update a subject
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const { sspCode, name, yearLevel, sessions, semester, hours, schoolYear } = req.body;
    
    // Get system options for default zero day session
    let defaultZeroDayTitle = 'INTRODUCTION';
    try {
      const systemOptions = await SystemOption.findOne().sort({ updatedAt: -1 });
      if (systemOptions && systemOptions.subject && systemOptions.subject.defaultZeroDayTitle) {
        defaultZeroDayTitle = systemOptions.subject.defaultZeroDayTitle;
      }
    } catch (error) {
      console.error('Error getting system options:', error);
      // Continue with default
    }
    
    // Find subject by ID
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    // Validate sessions
    const processedSessions = [];
    let hasZeroDay = false;
    
    if (sessions && sessions.length > 0) {
      for (const session of sessions) {
        processedSessions.push({
          day: session.day,
          title: session.title
        });
        
        if (session.day === 0) {
          hasZeroDay = true;
        }
      }
    }
    
    // Always add day zero if not provided
    if (!hasZeroDay) {
      processedSessions.push({
        day: 0,
        title: defaultZeroDayTitle
      });
    }
    
    // Update subject
    subject.sspCode = sspCode;
    subject.name = name;
    subject.yearLevel = yearLevel;
    subject.sessions = processedSessions;
    subject.semester = semester;
    subject.hours = hours;
    subject.schoolYear = schoolYear;
    subject.updatedAt = Date.now();
    
    // Save updated subject
    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (err) {
    console.error('Error updating subject:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).send('Server Error');
  }
});

// Delete subject
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    await subject.remove();
    res.json({ message: 'Subject removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 