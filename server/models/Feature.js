const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    icon: {
      type: String, // SVG path or icon name
      default: '',
    },
    category: {
      type: String,
      enum: ['training', 'nutrition', 'analytics', 'community', 'coaching'],
      default: 'training',
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feature', featureSchema);
