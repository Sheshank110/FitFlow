const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: 'fallback',
    },
  },
  { timestamps: true }
);

chatLogSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('ChatLog', chatLogSchema);
