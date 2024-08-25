import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface RequestWithUser extends Request {
  user: any;
}

export const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const secretKey = process.env.JWT_SECRET || 'default-secret-key';
    const decoded = verify(token, secretKey) as any;
    (req as RequestWithUser).user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};