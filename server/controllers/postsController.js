const Post = require('../models/Post');

// GET /api/posts?page=1&limit=6&tag=nutrition
const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(12, parseInt(req.query.limit) || 6);
    const skip = (page - 1) * limit;

    const filter = { published: true };
    if (req.query.tag) filter.tags = req.query.tag;

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-body'),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:slug
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPosts, getPost };
