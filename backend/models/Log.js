import mongoose from 'mongoose';

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
});

logSchema.index({ createdAt: -1 });

const Log = mongoose.model('Log', logSchema);

export default Log;
