const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., 'CREATE_BLOG', 'LOGIN', etc.
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: false,
  },
  userAgent: { type: String },
  ip: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now },

  // Add these:
  status: {
    type: String,
    enum: ['success', 'failure', 'info'],
    default: 'info',
  },
  message: { type: String, required: true }, // human-readable description
  referrer: { type: String }, // where the request came from (optional)
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    required: false,
  },
});
