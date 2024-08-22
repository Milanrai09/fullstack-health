import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();


const secretkey = process.env.JWT_SECRET;


if (!secretkey) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface JwtPayload {
  userId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretkey) as JwtPayload;


    if (!decoded.isAdmin) {

      return res.status(403).json({ error: 'Access denied. You are not an admin.' });
    }



    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired.' });
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    // For any other errors
    return res.status(500).json({ error: 'Internal server error.' });
  }
};