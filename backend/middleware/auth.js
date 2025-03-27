const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({ message: 'User account is not active' });
      }
      
      // Set user in request
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Admin authorization middleware
exports.authorizeAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Adviser authorization middleware
exports.authorizeAdviser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Access denied. Admin or adviser role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Adviser authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
}; 