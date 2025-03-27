const express = require('express');
const router = express.Router();
const SystemOption = require('../models/SystemOption');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

/**
 * @route   GET /api/system-options
 * @desc    Get system options
 * @access  Public (for now, can be restricted later if needed)
 */
router.get('/', async (req, res) => {
  try {
    // Find the most recent options or create default if none exists
    let options = await SystemOption.findOne().sort({ updatedAt: -1 });
    
    if (!options) {
      options = new SystemOption();
      await options.save();
    }
    
    return res.json(options);
  } catch (error) {
    console.error('Error fetching system options:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/system-options
 * @desc    Update system options
 * @access  Private/Admin
 */
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const { class: classOptions, subject: subjectOptions } = req.body;
    
    // Find the most recent options or create a new one
    let options = await SystemOption.findOne().sort({ updatedAt: -1 });
    
    if (!options) {
      options = new SystemOption();
    }
    
    // Update options
    if (classOptions) {
      options.class = {
        ...options.class,
        ...classOptions
      };
    }
    
    if (subjectOptions) {
      options.subject = {
        ...options.subject,
        ...subjectOptions
      };
    }
    
    // Save the updated options
    await options.save();
    
    return res.json(options);
  } catch (error) {
    console.error('Error updating system options:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/system-options/reset
 * @desc    Reset system options to defaults
 * @access  Private/Admin
 */
router.post('/reset', auth, isAdmin, async (req, res) => {
  try {
    // Create a new instance with default values
    const defaultOptions = new SystemOption();
    await defaultOptions.save();
    
    return res.json(defaultOptions);
  } catch (error) {
    console.error('Error resetting system options:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
