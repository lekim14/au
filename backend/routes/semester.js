const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Get all system options - allow public access for read-only
router.get('/', async (req, res) => {
  try {
    let semesters = await Semester.find();

    res.json(semesters);
  } catch (error) {
    console.error('Error getting semesters:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, schoolYear } = req.body;

    const newSemester = new Semester({
        title: title,
        description: description,
        schoolYear: schoolYear
    })

    await newSemester.save();
    res.status(201).json({ message: 'Semester created successfully', semester: newSemester });
  } catch (error) {
    console.error('Error creating semester:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/status', authenticate, authorizeAdmin, async (req, res) => {
    try {
      const { status, id } = req.body;

      const activeSemester = await Semester.find({ status: 'active' });
      const updateActiveSemester = await Semester.findById(activeSemester[0]._id);
      updateActiveSemester.status = 'inactive';
      await updateActiveSemester.save();
  
      const semester = await Semester.findById(id);
      semester.status = status
  
      await semester.save();
      res.status(201).json({ message: 'Semester updated successfully', semester: semester });
    } catch (error) {
      console.error('Error updating semester:', error);
      res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
