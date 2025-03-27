/**
 * Middleware for role-based authorization
 */

// Admin authorization middleware
exports.isAdmin = (req, res, next) => {
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
exports.isAdviser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Access denied. Adviser role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Adviser authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Admin or adviser authorization middleware
exports.isAdminOrAdviser = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'admin' && req.user.role !== 'adviser') {
      return res.status(403).json({ message: 'Access denied. Admin or adviser role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Student authorization middleware
exports.isStudent = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Student role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Student authorization error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};
