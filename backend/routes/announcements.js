const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { authenticate, authorizeAdmin, authorizeAdviser } = require('../middleware/auth');

// Get all announcements
router.get('/', authenticate, async (req, res) => {
  try {
    // Filter announcements based on user role
    let filter = {};
    
    if (req.user.role === 'student') {
      filter = {
        $or: [
          { targetAudience: 'all' },
          { targetAudience: 'students' }
        ]
      };
    } else if (req.user.role === 'adviser') {
      filter = {
        $or: [
          { targetAudience: 'all' },
          { targetAudience: 'advisers' }
        ]
      };
    }
    
    // Get announcements and populate author details
    const announcements = await Announcement.find(filter)
      .sort({ isPinned: -1, createdAt: -1 })
      .populate('author', 'firstName lastName');
    
    res.json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get announcement by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('author', 'firstName lastName');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Check if user has permission to view this announcement
    if (req.user.role === 'student' && announcement.targetAudience === 'advisers') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    if (req.user.role === 'adviser' && announcement.targetAudience === 'students') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new announcement
router.post('/', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { title, content, targetAudience, isPinned } = req.body;
    
    // Create announcement
    const announcement = new Announcement({
      title,
      content,
      author: req.user._id,
      targetAudience: targetAudience || 'all',
      isPinned: isPinned || false
    });
    
    await announcement.save();
    
    res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update announcement
router.put('/:id', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const { title, content, targetAudience, isPinned } = req.body;
    
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only edit your own announcements' });
    }
    
    // Update fields
    if (title) announcement.title = title;
    if (content) announcement.content = content;
    
    // Only admin can change targetAudience and pinned status
    if (req.user.role === 'admin') {
      if (targetAudience) announcement.targetAudience = targetAudience;
      if (isPinned !== undefined) announcement.isPinned = isPinned;
    }
    
    announcement.updatedAt = Date.now();
    await announcement.save();
    
    res.json({ message: 'Announcement updated successfully' });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete announcement
router.delete('/:id', authenticate, authorizeAdviser, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Check if user is the author or admin
    if (announcement.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own announcements' });
    }
    
    await Announcement.deleteOne({ _id: announcement._id });
    
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pin/unpin announcement (admin only)
router.put('/:id/pin', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { isPinned } = req.body;
    
    if (isPinned === undefined) {
      return res.status(400).json({ message: 'isPinned field is required' });
    }
    
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    announcement.isPinned = isPinned;
    announcement.updatedAt = Date.now();
    
    await announcement.save();
    
    res.json({ message: `Announcement ${isPinned ? 'pinned' : 'unpinned'} successfully` });
  } catch (error) {
    console.error('Pin announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 