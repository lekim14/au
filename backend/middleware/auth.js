const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    if (user.status !== 'active') {
      return res.status(401).json({ message: 'User account is not active' });
    }
    
    // Update last active timestamp
    user.lastActive = Date.now();
    await user.save();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required' });
  }
  next();
};

exports.authorizeAdviser = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'adviser') {
    return res.status(403).json({ message: 'Access denied. Adviser privileges required' });
  }
  next();
}; 