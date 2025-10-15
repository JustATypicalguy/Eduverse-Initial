import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Assuming you use JWT for authentication

// This should be in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'DEFAULT_SECRET_KEY';

// A basic User interface. You should expand this to match your database schema.
interface AuthenticatedUser {
    id: string;
    role: 'student' | 'teacher' | 'admin';
}

// Extend the Express Request interface to include the user object
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

/**
 * Middleware to verify if a user is authenticated via a JWT token.
 * It checks for a token in the Authorization header.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
        req.user = decoded; // Attach user information to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

/**
 * Middleware to verify if the authenticated user has an 'admin' role.
 * This should be used *after* the isAuthenticated middleware.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};