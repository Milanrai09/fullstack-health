// // Import necessary modules
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// // Define middleware function
// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   // Get token from request header
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   // Check if token is missing
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized: Missing token' });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, 'your_secret_key') as { _id: string }; // Replace with your JWT secret

//     // Set user information on request object
//     req.user = decoded;

//     // Continue to next middleware or route handler
//     next();
//   } catch (error) {
//     // Handle invalid token
//     console.error('Token verification error:', error);
//     res.status(401).json({ error: 'Unauthorized: Invalid token' });
//   }
// };


// export const authorize = (roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).send({ error: 'Access denied.' });
//         }
//         next();
//     };
// };
