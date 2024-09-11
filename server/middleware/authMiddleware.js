import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const protect = async (req, res, next) => {
  console.log("hello world")
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get the token from the header
      token = req.headers.authorization.split(' ')[1];
      console.log("Token received:", token)

      if (!token) {
        throw new Error('Token is empty after splitting');
      }
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '1234!@#%<{*&)');

      // Get the user from the token, excluding the password
      req.user = await User.findById(decoded.user).select('-password');

      // Call the next middleware
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};