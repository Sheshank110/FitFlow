const Pricing = require('../models/Pricing');

// GET /api/pricing
const getPricing = async (req, res, next) => {
  try {
    const plans = await Pricing.find().sort({ order: 1 });
    res.json({ success: true, data: plans });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPricing };
