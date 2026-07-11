const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: {
      type: String,
      default: 'FitFlow Team',
    },
    readTime: {
      type: Number, // in minutes
      default: 5,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

postSchema.index({ tags: 1 });
postSchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
