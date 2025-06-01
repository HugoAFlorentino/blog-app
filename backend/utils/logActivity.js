import Log from '../models/Log.js';

const logActivity = async ({
  userId,
  action,
  blogId = null,
  req,
  details = {},
}) => {
  try {
    await Log.create({
      userId,
      action,
      blogId,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || req.connection?.remoteAddress || '',
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

export default logActivity;
