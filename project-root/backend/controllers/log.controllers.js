import Log from '../models/Log.js';

export const getLogs = async (req, res) => {
  try {
    // Parse page and limit from query params, default to page 1, limit 50
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    // Fetch logs with pagination, newest first
    const paginatedLogs = await Log.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalLogs = await Log.countDocuments();

    res.json({
      logs: paginatedLogs,
      currentPage: page,
      totalPages: Math.ceil(totalLogs / limit),
      totalLogs,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Failed to fetch logs' });
  }
};
