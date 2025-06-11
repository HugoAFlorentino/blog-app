const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
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
  message: { type: String, required: true },
  referrer: { type: String },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    required: false,
  },
});

const Log = mongoose.model('Log', logSchema);

export default Log;
