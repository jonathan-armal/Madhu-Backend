const jwt = require('jsonwebtoken');
const User = require('../models/User');
const createError = require('http-errors');

exports.protect = async (req, res, next) => {
  try {
    // 1. Get token from header or cookie
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(createError(401, 'Not authorized, no token provided'));
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (verifyError) {
      if (verifyError.name === 'TokenExpiredError') {
        return next(createError(401, 'Token expired, please login again'));
      }
      return next(createError(401, 'Not authorized, invalid token'));
    }

    // 3. Get user from token
    const user = await User.findById(decoded.id)
      .select('-password -__v -createdAt -updatedAt')
      .lean();

    if (!user) {
      return next(createError(401, 'User not found'));
    }

    // 4. Check if user changed password after token was issued
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      
      if (decoded.iat < changedTimestamp) {
        return next(
          createError(401, 'User recently changed password, please login again')
        );
      }
    }

    // 5. Attach user to request
    req.user = user;
    
    // 6. Add user to response locals for views if needed
    res.locals.user = user;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(error);
  }
};

// Role-based authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(403, 'You do not have permission to perform this action')
      );
    }
    next();
  };
};

// Optional authentication for public routes
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id)
        .select('-password -__v -createdAt -updatedAt')
        .lean();
      
      if (user) {
        req.user = user;
        res.locals.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Don't block the request if auth fails for optional auth
    next();
  }
};