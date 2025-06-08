import Log from '../models/Log.js';

const logActivity = async ({
  userId,
  action,
  blogId = null,
  req = {},
  details = {},
}) => {
  try {
    const userAgent = req?.headers?.['user-agent'] || 'unknown';
    const ip = req?.ip || req?.connection?.remoteAddress || 'unknown';

    await Log.create({
      userId,
      action,
      blogId,
      userAgent,
      ip,
      details,
    });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

export default logActivity;
