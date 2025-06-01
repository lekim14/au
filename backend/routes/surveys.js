const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SurveyData = require('../models/SurveyData');
const { authenticate } = require('../middleware/auth');
const Semester = require('../models/Semester');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/surveys';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'survey-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Submit survey screenshot
router.post('/submit', authenticate, upload.single('screenshot'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const activeSemester = await Semester.find({ status: 'active' });
    if(!activeSemester){
      return res.status(400).json({ message: 'Action cannot be done.' });
    }
    console.log(activeSemester)
    const newSurveyData = new SurveyData({
      studentId: req.user._id,
      screenshotUrl: `/uploads/surveys/${req.file.filename}`,
      semester: activeSemester[0]?._id
    });

    await newSurveyData.save();
    
    return res.status(201).json({
      success: true,
      message: 'Survey screenshot submitted successfully',
      data: newSurveyData
    });
  } catch (error) {
    console.error('Error submitting survey:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to submit survey',
      error: error.message 
    });
  }
});

// Get student's survey submissions
router.get('/my-submissions', authenticate, async (req, res) => {
  try {
    const submissions = await SurveyData.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching survey submissions:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch survey submissions',
      error: error.message 
    });
  }
});

// For admin/advisers to get all submissions
router.get('/all', authenticate, async (req, res) => {
  try {
    // Check if user has admin/adviser role
    if (req.user.role !== 'admin' && req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // const submissions = await SurveyData.find()
    //   .sort({ createdAt: -1 })
    //   .populate({
    //     path: 'studentId',
    //     // select: '_id',
    //     model: 'User'
    //   })

    const submissions = await SurveyData.aggregate([
      // Lookup to students collection
      {
        $lookup: {
          from: 'students',         // students collection name in MongoDB
          localField: 'studentId',  // field in SurveyData
          foreignField: 'user',      // field in students
          as: 'studentData'         // resulting array field
        }
      },
      {
        $unwind: {
          path: '$studentData',
          preserveNullAndEmptyArrays: true
        }
      },  
      // Lookup to users collection
      {
        $lookup: {
          from: 'users',            // users collection name in MongoDB
          localField: 'studentId',  // same field in SurveyData
          foreignField: '_id',      // field in users
          as: 'userData'            // resulting array field
        }
      },
      {
        $unwind: {
          path: '$userData',
          preserveNullAndEmptyArrays: true
        }
      },
    
      {
        $sort: { createdAt: -1 }
      }
    ]);
    
    
    return res.status(200).json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching all survey submissions:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to fetch survey submissions',
      error: error.message 
    });
  }
});

// Update submission status (approve/reject)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    // Check if user has admin/adviser role
    if (req.user.role !== 'admin' && req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { status } = req.body;
    if (!status || !['approved', 'rejected', 'pending'].includes(status)) {
      // return res.status(400).json({ message: 'Invalid status' });
    }
    
    const submission = await SurveyData.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: `Submission ${status} successfully`,
      data: submission
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Failed to update submission status',
      error: error.message 
    });
  }
});

module.exports = router; 