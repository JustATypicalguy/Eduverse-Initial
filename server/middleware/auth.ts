import type { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Simple authentication middleware (in production, use proper JWT/session)
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  console.log('Auth middleware - Headers:', req.headers.authorization ? 'Present' : 'Missing');
  console.log('Auth middleware - Request path:', req.path);
  console.log('Auth middleware - Request body:', JSON.stringify(req.body, null, 2));
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth middleware - No valid authorization header');
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  console.log('Auth middleware - Token received (first 20 chars):', token.substring(0, 20) + '...');
  
  // Simple token validation (in production, verify JWT signature)
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    console.log('Auth middleware - Decoded token:', decoded);
    if (decoded.userId && decoded.role) {
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      console.log('Auth middleware - User authenticated:', decoded.userId, decoded.role);
      next();
    } else {
      console.log('Auth middleware - Invalid token format, missing userId or role');
      res.status(401).json({ message: 'Invalid token format' });
    }
  } catch (error) {
    console.log('Auth middleware - Token decode error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based permission middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

// Simple token generation for development/testing
export const generateToken = (userId: string, role: string): string => {
  const payload = { userId, role };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export type { AuthenticatedRequest };