import jwt from 'jsonwebtoken';
import { ACCESS_SECRET } from '../config/env.config.js';
import User from '../models/User.js';

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: 'Authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authenticateUser;
