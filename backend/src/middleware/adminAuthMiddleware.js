// middleware/adminAuthMiddleware.js - PERBAIKAN UTAMA
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

// ===== MAIN ADMIN AUTH MIDDLEWARE =====
export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        error: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
        error: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get admin data
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin not found.',
        error: 'ADMIN_NOT_FOUND'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Account has been deactivated.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Check token expiration (optional double check)
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token has expired.',
        error: 'TOKEN_EXPIRED'
      });
    }

    // Add admin data to request
    req.admin = admin;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token has expired.',
        error: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.',
        error: 'INVALID_TOKEN'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      error: 'AUTH_ERROR'
    });
  }
};

// ===== ALIAS untuk backward compatibility =====
export const authMiddleware = adminAuthMiddleware;

// ===== SUPER ADMIN MIDDLEWARE =====
export const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin role required.',
        error: 'INSUFFICIENT_ROLE',
        required: 'super-admin',
        current: req.admin.role
      });
    }
    
    next();
  } catch (error) {
    console.error('Super Admin Check Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during role checking.',
      error: 'ROLE_CHECK_ERROR'
    });
  }
};

// ===== ROLE-BASED ACCESS CONTROL =====
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.',
          error: 'NOT_AUTHENTICATED'
        });
      }

      const adminRole = req.admin.role;
      
      // Convert single role to array
      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Super admin has access to everything
      if (adminRole === 'super-admin') {
        return next();
      }
      
      // Check if admin role is in allowed roles
      if (!roles.includes(adminRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${adminRole}`,
          error: 'INSUFFICIENT_ROLE',
          required: roles,
          current: adminRole
        });
      }
      
      next();
    } catch (error) {
      console.error('Role Check Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during role checking.',
        error: 'ROLE_CHECK_ERROR'
      });
    }
  };
};

// ===== PERMISSION-BASED ACCESS CONTROL =====
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Access denied. Authentication required.',
          error: 'NOT_AUTHENTICATED'
        });
      }

      const admin = req.admin;
      
      // Super admin has all permissions
      if (admin.role === 'super-admin') {
        return next();
      }
      
      // Check if admin has the required permission
      if (!admin.permissions || !admin.permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${requiredPermission}`,
          error: 'INSUFFICIENT_PERMISSION',
          required: requiredPermission,
          available: admin.permissions || []
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission Check Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during permission checking.',
        error: 'PERMISSION_CHECK_ERROR'
      });
    }
  };
};

// ===== RATE LIMITING MIDDLEWARE =====
const rateLimitStore = new Map();

export const rateLimitMiddleware = (maxRequests = 10, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    try {
      const identifier = req.admin?.id || req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Get or create rate limit entry
      if (!rateLimitStore.has(identifier)) {
        rateLimitStore.set(identifier, []);
      }
      
      const requests = rateLimitStore.get(identifier);
      
      // Remove old requests outside the window
      const validRequests = requests.filter(time => time > windowStart);
      rateLimitStore.set(identifier, validRequests);
      
      // Check if limit exceeded
      if (validRequests.length >= maxRequests) {
        const resetTime = new Date(validRequests[0] + windowMs);
        
        return res.status(429).json({
          success: false,
          message: `Too many requests. Try again after ${resetTime.toISOString()}`,
          error: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((validRequests[0] + windowMs - now) / 1000)
        });
      }
      
      // Add current request
      validRequests.push(now);
      rateLimitStore.set(identifier, validRequests);
      
      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - validRequests.length);
      res.setHeader('X-RateLimit-Reset', Math.ceil((windowStart + windowMs) / 1000));
      
      next();
    } catch (error) {
      console.error('Rate Limit Error:', error);
      next(); // Continue on error
    }
  };
};

// ===== IP WHITELIST MIDDLEWARE =====
export const ipWhitelistMiddleware = (allowedIPs = []) => {
  return (req, res, next) => {
    try {
      if (allowedIPs.length === 0) {
        return next(); // No restrictions if no IPs specified
      }
      
      const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      
      if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. IP address not allowed.',
          error: 'IP_NOT_ALLOWED',
          clientIP: clientIP
        });
      }
      
      next();
    } catch (error) {
      console.error('IP Whitelist Error:', error);
      next(); // Continue on error
    }
  };
};

// ===== ADMIN SESSION MIDDLEWARE =====
export const adminSessionMiddleware = async (req, res, next) => {
  try {
    if (!req.admin) {
      return next();
    }
    
    // Update last activity
    await Admin.findByIdAndUpdate(req.admin.id, {
      lastActivity: new Date(),
      lastIP: req.ip
    });
    
    next();
  } catch (error) {
    console.error('Session Middleware Error:', error);
    next(); // Continue on error
  }
};

// ===== EXPORT ALL MIDDLEWARE =====
export default {
  adminAuthMiddleware,
  authMiddleware,
  requireSuperAdmin,
  checkRole,
  checkPermission,
  rateLimitMiddleware,
  ipWhitelistMiddleware,
  adminSessionMiddleware
};