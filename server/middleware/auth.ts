import type { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

// Simple authentication middleware (in production, use proper JWT/session)
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  
  // Simple token validation (in production, verify JWT signature)
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (decoded.userId && decoded.role) {
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token format' });
    }
  } catch (error) {
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