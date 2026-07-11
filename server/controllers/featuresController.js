const Feature = require('../models/Feature');

// GET /api/features?category=training
const getFeatures = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const features = await Feature.find(filter).sort({ order: 1 });
    res.json({ success: true, data: features });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFeatures };
